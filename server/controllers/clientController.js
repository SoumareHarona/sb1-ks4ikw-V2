import { v4 as uuidv4 } from 'uuid';
import { asyncGet, asyncRun } from '../db.js';
import { generateTrackingNumber } from '../utils/tracking.js';
import { generateQRCode } from '../utils/qrcode.js';
import { sendNotification } from '../utils/notifications.js';
import { calculatePrice } from '../pricing.js';

export async function createClient(db, data) {
  try {
    // Validate required fields
    const requiredFields = ['freightNumberId', 'senderName', 'senderPhone', 'recipientName', 'recipientPhone', 'packaging'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
      error.status = 400;
      throw error;
    }

    // Get freight number details
    const freightNumber = await asyncGet(
      'SELECT id, number, mode, origin, destination FROM freight_numbers WHERE id = ?', 
      [data.freightNumberId]
    );

    if (!freightNumber) {
      const error = new Error('Invalid freight number');
      error.status = 404;
      throw error;
    }

    // Clean and validate numeric values
    const cleanData = {
      foodWeight: parseFloat(data.foodWeight) || 0,
      nonFoodWeight: parseFloat(data.nonFoodWeight) || 0,
      hn7Weight: parseFloat(data.hn7Weight) || 0,
      length: parseFloat(data.length) || null,
      width: parseFloat(data.width) || null,
      height: parseFloat(data.height) || null,
      additionalFeesAmount: parseFloat(data.additionalFeesAmount) || 0,
      advanceAmount: parseFloat(data.advanceAmount) || 0
    };

    // Validate numeric values
    Object.entries(cleanData).forEach(([key, value]) => {
      if (value !== null && (isNaN(value) || value < 0)) {
        const error = new Error(`Invalid ${key}: must be a non-negative number`);
        error.status = 400;
        throw error;
      }
    });

    // Calculate price
    const price = calculatePrice(
      freightNumber.mode,
      {
        food: cleanData.foodWeight,
        nonFood: cleanData.nonFoodWeight,
        hn7: cleanData.hn7Weight
      },
      freightNumber.mode === 'sea' ? {
        length: cleanData.length,
        width: cleanData.width,
        height: cleanData.height
      } : undefined,
      {
        amount: cleanData.advanceAmount.toString(),
        currency: data.advanceCurrency || 'EUR'
      }
    );

    const id = uuidv4();
    
    // Generate tracking number with new format
    const trackingNumber = generateTrackingNumber(
      freightNumber.origin,
      freightNumber.destination,
      freightNumber.number.split('-')[2], // Extract sequential number
      freightNumber.mode
    );

    // Generate QR code with shipment details
    const qrCode = await generateQRCode({
      trackingNumber,
      freightNumber: freightNumber.number,
      mode: freightNumber.mode,
      origin: freightNumber.origin,
      destination: freightNumber.destination,
      sender: {
        name: data.senderName,
        phone: data.senderPhone
      },
      recipient: {
        name: data.recipientName,
        phone: data.recipientPhone
      },
      payment: {
        baseAmount: price.baseAmountEUR,
        baseAmountXOF: price.baseAmountXOF,
        advanceAmount: price.advanceAmountEUR,
        advanceAmountXOF: price.advanceAmountXOF,
        remainingAmount: price.remainingEUR,
        remainingAmountXOF: price.remainingXOF
      }
    });

    // Begin transaction
    await asyncRun('BEGIN TRANSACTION');

    try {
      // Insert the client record
      await asyncRun(`
        INSERT INTO clients (
          id, freight_number_id, tracking_number, qr_code,
          sender_name, sender_phone,
          recipient_name, recipient_phone, recipient_email,
          recipient_street, recipient_city, recipient_landmark, recipient_notes,
          food_weight, non_food_weight, hn7_weight,
          length, width, height,
          package_type, packaging, special_handling, comments,
          additional_fees_amount, additional_fees_currency,
          advance_amount, advance_currency,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, [
        id,
        data.freightNumberId,
        trackingNumber,
        qrCode,
        data.senderName.trim(),
        data.senderPhone.trim(),
        data.recipientName.trim(),
        data.recipientPhone.trim(),
        data.recipientEmail?.trim() || null,
        data.recipientStreet?.trim() || null,
        data.recipientCity?.trim() || null,
        data.recipientLandmark?.trim() || null,
        data.recipientNotes?.trim() || null,
        cleanData.foodWeight,
        cleanData.nonFoodWeight,
        cleanData.hn7Weight,
        cleanData.length,
        cleanData.width,
        cleanData.height,
        data.packageType || null,
        data.packaging.trim(),
        JSON.stringify(data.specialHandling || []),
        data.comments?.trim() || null,
        cleanData.additionalFeesAmount,
        data.additionalFeesCurrency || 'EUR',
        cleanData.advanceAmount,
        data.advanceCurrency || 'EUR'
      ]);

      // Commit transaction
      await asyncRun('COMMIT');

      // Send notifications after successful commit
      await Promise.all([
        sendNotification(data.senderPhone, `Your shipment has been created with tracking number: ${trackingNumber}`),
        sendNotification(data.recipientPhone, `A shipment is on its way to you. Tracking number: ${trackingNumber}`)
      ]);

      return {
        id,
        trackingNumber,
        qrCode,
        message: 'Shipment created successfully',
        payment: {
          baseAmount: price.baseAmountEUR,
          baseAmountXOF: price.baseAmountXOF,
          advanceAmount: price.advanceAmountEUR,
          advanceAmountXOF: price.advanceAmountXOF,
          remainingAmount: price.remainingEUR,
          remainingAmountXOF: price.remainingXOF
        }
      };
    } catch (error) {
      // Rollback transaction on error
      await asyncRun('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating client:', error);
    throw {
      status: error.status || 500,
      message: error.message || 'Failed to create client',
      details: error.details || error.stack
    };
  }
}