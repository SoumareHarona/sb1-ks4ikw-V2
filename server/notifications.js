export function generateTrackingNumber(freightNumber) {
  // Format: {COUNTRY}-FRET{XXXX}-{RANDOM}
  // Example: FR-FRET0003-HYYC
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // The freight number is already in the correct format (e.g., "FR-FRET-0003")
  // We just need to remove the middle dash and add the random suffix
  const formattedNumber = freightNumber.replace(/-FRET-/, '-FRET');
  
  return `${formattedNumber}-${random}`;
}

export async function generatePickupQR(shipmentData) {
  // Create a structured object with essential shipment information
  const qrData = {
    trackingNumber: shipmentData.trackingNumber,
    freightNumber: shipmentData.freightNumber,
    sender: {
      name: shipmentData.senderName,
      phone: shipmentData.senderPhone
    },
    recipient: {
      name: shipmentData.recipientName,
      phone: shipmentData.recipientPhone,
      address: {
        street: shipmentData.recipientStreet,
        city: shipmentData.recipientCity,
        landmark: shipmentData.recipientLandmark
      }
    },
    package: {
      type: shipmentData.packageType,
      description: shipmentData.packaging,
      weights: {
        food: shipmentData.foodWeight || 0,
        nonFood: shipmentData.nonFoodWeight || 0,
        hn7: shipmentData.hn7Weight || 0,
        total: (shipmentData.foodWeight || 0) + 
               (shipmentData.nonFoodWeight || 0) + 
               (shipmentData.hn7Weight || 0)
      },
      specialHandling: shipmentData.specialHandling || []
    },
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Generate QR code with the structured data
  return await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}

export async function sendNotification(phone, message) {
  if (!phone) {
    console.warn('No phone number provided for notification');
    return;
  }

  // For development, just log the notification
  console.log('[NOTIFICATION] To:', phone, 'Message:', message);
  return true;
}