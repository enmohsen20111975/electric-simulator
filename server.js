// Circuit Simulator - Backend Server
// Node.js + Express + MongoDB Full Stack Application

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const circuitRoutes = require('./routes/circuits');
const userRoutes = require('./routes/users');
const libraryRoutes = require('./routes/library');
const simulationRoutes = require('./routes/simulation');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/circuit-simulator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/circuits', authMiddleware, circuitRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/simulation', authMiddleware, simulationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0' 
    });
});

// Static files (frontend)
app.use(express.static('../frontend/dist'));

// WebSocket connection for real-time collaboration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a circuit collaboration room
    socket.on('join-circuit', (circuitId) => {
        socket.join(circuitId);
        socket.to(circuitId).emit('user-joined', socket.id);
        console.log(`User ${socket.id} joined circuit ${circuitId}`);
    });

    // Leave circuit room
    socket.on('leave-circuit', (circuitId) => {
        socket.leave(circuitId);
        socket.to(circuitId).emit('user-left', socket.id);
    });

    // Component updates
    socket.on('component-update', (data) => {
        socket.to(data.circuitId).emit('component-updated', {
            userId: socket.id,
            component: data.component
        });
    });

    // Wire updates
    socket.on('wire-update', (data) => {
        socket.to(data.circuitId).emit('wire-updated', {
            userId: socket.id,
            wire: data.wire
        });
    });

    // Simulation state updates
    socket.on('simulation-update', (data) => {
        socket.to(data.circuitId).emit('simulation-updated', {
            userId: socket.id,
            state: data.state
        });
    });

    // Chat messages for collaboration
    socket.on('chat-message', (data) => {
        socket.to(data.circuitId).emit('chat-message', {
            userId: socket.id,
            message: data.message,
            timestamp: Date.now()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
