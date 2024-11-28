import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncAll, asyncGet, asyncRun } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const freightNumbers = await asyncAll(`
      SELECT * FROM freight_numbers 
      ORDER BY created_at DESC
    `);
    res.json(freightNumbers);
  } catch (error) {
    console.error('Error fetching freight numbers:', error);
    res.status(500).json({
      error: 'Failed to retrieve freight numbers',
      details: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { mode, origin, destination, number } = req.body;

    // Validate required fields
    if (!mode || !origin || !destination || !number) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Mode, origin, destination, and number are required'
      });
    }

    // Validate number format
    if (!/^\d{1,4}$/.test(number)) {
      return res.status(400).json({
        error: 'Invalid freight number format',
        details: 'Number must be between 1 and 4 digits'
      });
    }

    // Format freight number
    const countryCode = origin.substring(0, 2).toUpperCase();
    const formattedNumber = `${countryCode}-FRET-${number.padStart(4, '0')}`;

    // Check if number already exists
    const existing = await asyncGet(
      'SELECT id FROM freight_numbers WHERE number = ?',
      [formattedNumber]
    );

    if (existing) {
      return res.status(400).json({ 
        error: 'This freight number already exists',
        details: `Freight number ${formattedNumber} is already in use`
      });
    }

    // Generate unique ID
    const id = uuidv4();

    // Begin transaction
    await asyncRun('BEGIN TRANSACTION');

    try {
      // Insert new freight number
      await asyncRun(`
        INSERT INTO freight_numbers (id, number, mode, origin, destination, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))
      `, [id, formattedNumber, mode, origin, destination]);

      // Commit transaction
      await asyncRun('COMMIT');

      // Return created freight number
      const created = await asyncGet(
        'SELECT * FROM freight_numbers WHERE id = ?',
        [id]
      );

      if (!created) {
        throw new Error('Failed to retrieve created freight number');
      }

      res.status(201).json(created);
    } catch (error) {
      // Rollback transaction on error
      await asyncRun('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating freight number:', error);
    res.status(500).json({
      error: 'Failed to create freight number',
      details: error.message
    });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await asyncRun(
      'UPDATE freight_numbers SET status = ? WHERE id = ?',
      [status, id]
    );

    if (!result.changes) {
      return res.status(404).json({ error: 'Freight number not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating freight status:', error);
    res.status(500).json({
      error: 'Failed to update freight status',
      details: error.message
    });
  }
});

export default router;