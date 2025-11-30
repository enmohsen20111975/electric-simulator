"""
Octopart API Client
Component pricing, availability, and technical data integration
Octopart by Altium - Electronics component search engine
"""

import requests
from typing import Dict, List, Any, Optional
import os
from datetime import datetime, timedelta
import json


class OctopartClient:
    """
    Octopart API client for component data
    Provides pricing, availability, datasheets, and specifications
    
    API Documentation: https://octopart.com/api/v4/
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Octopart client
        
        Args:
            api_key: Octopart API key (get from https://octopart.com/api/home)
                    If None, will try to read from environment variable OCTOPART_API_KEY
        """
        self.api_key = api_key or os.getenv("OCTOPART_API_KEY")
        self.base_url = "https://octopart.com/api/v4/endpoint"
        self.cache = {}
        self.cache_expiry = timedelta(hours=24)
        
        if not self.api_key:
            print("⚠️ Warning: Octopart API key not set. Limited functionality.")
    
    def search_parts(
        self,
        query: str,
        limit: int = 10,
        start: int = 0,
        filter_fields: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Search for electronic components
        
        Args:
            query: Search query (part number, manufacturer, description)
            limit: Maximum results to return
            start: Starting offset for pagination
            filter_fields: Additional filters (category, manufacturer, etc.)
        
        Returns:
            Dictionary containing search results
        """
        
        # Check cache
        cache_key = f"search_{query}_{limit}_{start}"
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_expiry:
                return cached_data
        
        if not self.api_key:
            return self._mock_search_results(query, limit)
        
        # GraphQL query for Octopart v4 API
        graphql_query = """
        query SearchParts($query: String!, $limit: Int!) {
          search(q: $query, limit: $limit) {
            results {
              part {
                id
                mpn
                manufacturer {
                  name
                }
                category {
                  name
                }
                short_description
                descriptions {
                  text
                }
                specs {
                  attribute {
                    name
                  }
                  display_value
                }
                sellers {
                  company {
                    name
                  }
                  offers {
                    sku
                    prices {
                      quantity
                      price
                      currency
                    }
                    inventory_level
                    packaging
                  }
                }
                datasheets {
                  url
                  name
                }
              }
            }
          }
        }
        """
        
        variables = {
            "query": query,
            "limit": limit
        }
        
        try:
            response = requests.post(
                self.base_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "query": graphql_query,
                    "variables": variables
                },
                timeout=10
            )
            
            response.raise_for_status()
            data = response.json()
            
            # Cache results
            self.cache[cache_key] = (data, datetime.now())
            
            return self._format_search_results(data)
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"API request failed: {str(e)}",
                "results": []
            }
    
    def get_part_by_mpn(
        self,
        mpn: str,
        manufacturer: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get component details by Manufacturer Part Number (MPN)
        
        Args:
            mpn: Manufacturer Part Number
            manufacturer: Manufacturer name (optional, improves accuracy)
        
        Returns:
            Detailed component information
        """
        
        query = mpn
        if manufacturer:
            query = f"{manufacturer} {mpn}"
        
        results = self.search_parts(query, limit=1)
        
        if results.get("success") and results.get("results"):
            return {
                "success": True,
                "part": results["results"][0]
            }
        else:
            return {
                "success": False,
                "error": "Part not found"
            }
    
    def get_pricing(
        self,
        mpn: str,
        quantity: int = 1,
        manufacturer: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get pricing information for a component
        
        Args:
            mpn: Manufacturer Part Number
            quantity: Order quantity
            manufacturer: Manufacturer name (optional)
        
        Returns:
            Pricing data from multiple distributors
        """
        
        part_data = self.get_part_by_mpn(mpn, manufacturer)
        
        if not part_data.get("success"):
            return {
                "success": False,
                "error": "Part not found"
            }
        
        part = part_data["part"]
        pricing_options = []
        
        for seller in part.get("sellers", []):
            seller_name = seller.get("company", {}).get("name", "Unknown")
            
            for offer in seller.get("offers", []):
                prices = offer.get("prices", [])
                
                # Find best price for quantity
                best_price = None
                for price_break in prices:
                    if price_break.get("quantity", 0) <= quantity:
                        best_price = price_break
                    else:
                        break
                
                if best_price:
                    pricing_options.append({
                        "distributor": seller_name,
                        "sku": offer.get("sku", ""),
                        "price": best_price.get("price", 0),
                        "currency": best_price.get("currency", "USD"),
                        "quantity": quantity,
                        "stock": offer.get("inventory_level", "Unknown"),
                        "packaging": offer.get("packaging", "Unknown")
                    })
        
        # Sort by price
        pricing_options.sort(key=lambda x: x.get("price", float('inf')))
        
        return {
            "success": True,
            "mpn": mpn,
            "manufacturer": part.get("manufacturer", {}).get("name", "Unknown"),
            "pricing": pricing_options
        }
    
    def get_specifications(
        self,
        mpn: str,
        manufacturer: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get technical specifications for a component
        
        Args:
            mpn: Manufacturer Part Number
            manufacturer: Manufacturer name (optional)
        
        Returns:
            Component specifications
        """
        
        part_data = self.get_part_by_mpn(mpn, manufacturer)
        
        if not part_data.get("success"):
            return {
                "success": False,
                "error": "Part not found"
            }
        
        part = part_data["part"]
        specs = {}
        
        for spec in part.get("specs", []):
            attr_name = spec.get("attribute", {}).get("name", "Unknown")
            value = spec.get("display_value", "N/A")
            specs[attr_name] = value
        
        return {
            "success": True,
            "mpn": mpn,
            "manufacturer": part.get("manufacturer", {}).get("name", "Unknown"),
            "category": part.get("category", {}).get("name", "Unknown"),
            "description": part.get("short_description", ""),
            "specifications": specs,
            "datasheets": part.get("datasheets", [])
        }
    
    def compare_distributors(
        self,
        mpn: str,
        quantity: int = 1
    ) -> Dict[str, Any]:
        """
        Compare prices across all distributors
        
        Args:
            mpn: Manufacturer Part Number
            quantity: Order quantity
        
        Returns:
            Comparison of distributors with pricing and availability
        """
        
        pricing_data = self.get_pricing(mpn, quantity)
        
        if not pricing_data.get("success"):
            return pricing_data
        
        # Group by distributor
        distributor_comparison = []
        
        for option in pricing_data.get("pricing", []):
            distributor_comparison.append({
                "distributor": option.get("distributor"),
                "price": option.get("price"),
                "total_cost": option.get("price", 0) * quantity,
                "currency": option.get("currency"),
                "stock": option.get("stock"),
                "sku": option.get("sku"),
                "packaging": option.get("packaging")
            })
        
        return {
            "success": True,
            "mpn": mpn,
            "quantity": quantity,
            "comparison": distributor_comparison,
            "best_price": distributor_comparison[0] if distributor_comparison else None
        }
    
    def _format_search_results(self, api_response: Dict) -> Dict[str, Any]:
        """Format Octopart API response"""
        
        try:
            results = api_response.get("data", {}).get("search", {}).get("results", [])
            
            formatted_results = []
            for result in results:
                part = result.get("part", {})
                
                formatted_results.append({
                    "id": part.get("id"),
                    "mpn": part.get("mpn"),
                    "manufacturer": part.get("manufacturer", {}).get("name", "Unknown"),
                    "category": part.get("category", {}).get("name", "Unknown"),
                    "description": part.get("short_description", ""),
                    "specs": self._extract_specs(part.get("specs", [])),
                    "sellers": len(part.get("sellers", [])),
                    "datasheets": part.get("datasheets", [])
                })
            
            return {
                "success": True,
                "count": len(formatted_results),
                "results": formatted_results
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to format results: {str(e)}",
                "results": []
            }
    
    def _extract_specs(self, specs: List[Dict]) -> Dict[str, str]:
        """Extract specifications to simple dict"""
        extracted = {}
        for spec in specs:
            attr_name = spec.get("attribute", {}).get("name", "")
            value = spec.get("display_value", "")
            if attr_name and value:
                extracted[attr_name] = value
        return extracted
    
    def _mock_search_results(self, query: str, limit: int) -> Dict[str, Any]:
        """Mock search results when API key not available"""
        
        # Sample component database for testing
        mock_parts = [
            {
                "id": "mock_1",
                "mpn": "1N4148",
                "manufacturer": "ON Semiconductor",
                "category": "Diodes",
                "description": "Standard Switching Diode, 100V, 200mA",
                "specs": {
                    "Voltage Rating": "100V",
                    "Current Rating": "200mA",
                    "Package": "DO-35"
                },
                "sellers": 15,
                "datasheets": [{"url": "https://example.com/1N4148.pdf", "name": "1N4148 Datasheet"}]
            },
            {
                "id": "mock_2",
                "mpn": "2N2222A",
                "manufacturer": "ON Semiconductor",
                "category": "BJT Transistors",
                "description": "NPN General Purpose Transistor",
                "specs": {
                    "Voltage Rating": "40V",
                    "Current Rating": "600mA",
                    "Power": "500mW",
                    "Package": "TO-92"
                },
                "sellers": 20,
                "datasheets": []
            },
            {
                "id": "mock_3",
                "mpn": "LM358",
                "manufacturer": "Texas Instruments",
                "category": "Operational Amplifiers",
                "description": "Dual Low-Power Op Amp",
                "specs": {
                    "Supply Voltage": "3V to 32V",
                    "Channels": "2",
                    "Package": "DIP-8"
                },
                "sellers": 25,
                "datasheets": []
            }
        ]
        
        # Filter mock results by query
        filtered = [p for p in mock_parts if query.lower() in p["mpn"].lower() or query.lower() in p["description"].lower()]
        
        return {
            "success": True,
            "count": len(filtered[:limit]),
            "results": filtered[:limit],
            "warning": "Using mock data - Set OCTOPART_API_KEY for real data"
        }


# Factory function
def create_octopart_client(api_key: Optional[str] = None) -> OctopartClient:
    """Create Octopart API client"""
    return OctopartClient(api_key)
