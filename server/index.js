import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase, asyncGet, asyncAll } from './db.js';
import clientRoutes from './routes/clientRoutes.js';
import freightRoutes from './routes/freightRoutes.js';
import shipmentRoutes from './routes/shipments.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Changed default port to 3001

console.log('Starting server configuration...');
console.log('Server port:', port);

// Enable CORS with specific origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Add basic test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Add basic health check route
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add database check route
app.get('/db-check', async (req, res) => {
  console.log('Database check requested');
  try {
    const db = await getDatabase();
    console.log('Database connection successful');
    
    const freightCount = await asyncGet('SELECT COUNT(*) as count FROM freight_numbers');
    const clientCount = await asyncGet('SELECT COUNT(*) as count FROM clients');
    
    console.log('Database counts:', { freight: freightCount, clients: clientCount });
    
    res.json({
      status: 'ok',
      counts: {
        freightNumbers: freightCount.count,
        clients: clientCount.count
      }
    });
  } catch (error) {
    console.error('Database check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    // Wait for database to be fully initialized
    const db = await getDatabase();
    console.log('Database initialized successfully');

    // Verify tables exist
    const tables = await asyncAll(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('clients', 'freight_numbers', 'shipments')
    `);
    console.log('Available tables:', tables.map(t => t.name));

    // API Routes with prefixes
    app.use('/api/clients', clientRoutes);
    app.use('/api/freight-numbers', freightRoutes);
    app.use('/api/shipments', shipmentRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Global error handler caught:', {
        url: req.url,
        method: req.method,
        error: {
          message: err.message,
          stack: err.stack,
          status: err.status
        }
      });
      
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // 404 handler
    app.use((req, res) => {
      console.log('404 Not Found:', req.url);
      res.status(404).json({
        error: 'Not Found',
        path: req.url
      });
    });

    // Start server
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log('Available routes:');
      console.log('- GET /');
      console.log('- GET /health');
      console.log('- GET /db-check');
      console.log('- GET /api/dashboard');
      console.log('- GET /api/clients');
      console.log('- GET /api/freight-numbers');
      console.log('- GET /api/shipments');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', {
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
console.log('Starting server...');
startServer().catch(error => {
  console.error('Application startup failed:', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});
