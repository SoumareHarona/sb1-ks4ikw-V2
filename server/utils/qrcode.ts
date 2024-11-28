import QRCode from 'qrcode';
import type { Shipment } from '../../src/types';

interface QRCodeData {
  trackingNumber: string;
  freightNumber: string;
  mode: string;
  origin: string;
  destination: string;
  sender: {
    name: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
  };
  payment?: {
    baseAmount: number;
    baseAmountXOF: number;
    advanceAmount: number;
    advanceAmountXOF: number;
    remainingAmount: number;
    remainingAmountXOF: number;
  };
  createdAt: string;
}

export async function generateQRCode(shipment: Partial<Shipment>): Promise<string> {
  try {
    // Create structured data for QR code
    const qrData: QRCodeData = {
      trackingNumber: shipment.trackingNumber!,
      freightNumber: shipment.freightNumber!,
      mode: shipment.mode!,
      origin: shipment.origin!,
      destination: shipment.destination!,
      sender: {
        name: shipment.sender?.name!,
        phone: shipment.sender?.phone!,
      },
      recipient: {
        name: shipment.recipient?.name!,
        phone: shipment.recipient?.phone!,
      },
      payment: shipment.payment,
      createdAt: new Date().toISOString()
    };

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      type: 'image/png',
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}