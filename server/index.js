import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase } from './db.js';
import clientRoutes from './routes/clientRoutes.js';
import freightRoutes from './routes/freightRoutes.js';
import shipmentRoutes from './routes/shipments.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Initialize database before setting up routes
async function initializeApp() {
  try {
    // Initialize database
    await getDatabase();
    console.log('Database initialized successfully');

    // API Routes
    app.use('/api/clients', clientRoutes);
    app.use('/api/freight-numbers', freightRoutes);
    app.use('/api/shipments', shipmentRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // Start server
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Start the application
initializeApp().catch(error => {
  console.error('Application startup failed:', error);
  process.exit(1);
});