import { jsPDF } from 'jspdf';
import type { Shipment } from '../types';

export async function generateShippingLabel(shipment: Shipment): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6'
  });

  // Add company logo
  doc.addImage(
    'https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png',
    'PNG',
    10,
    10,
    50,
    20
  );

  // Add tracking information
  doc.setFontSize(14);
  doc.text('Tracking Number:', 10, 40);
  doc.setFontSize(16);
  doc.text(shipment.trackingNumber, 10, 48);

  // Add QR code if available
  if (shipment.qrCode) {
    doc.addImage(shipment.qrCode, 'PNG', 65, 80, 30, 30);
  }

  // Add recipient information
  doc.setFontSize(12);
  doc.text('Recipient:', 10, 65);
  doc.setFontSize(10);
  doc.text(shipment.recipient.name, 10, 72);
  doc.text(shipment.recipient.phone, 10, 78);

  // Add route information
  doc.setFontSize(12);
  doc.text('Route:', 10, 95);
  doc.setFontSize(10);
  doc.text(`${shipment.origin} → ${shipment.destination}`, 10, 102);

  return doc.output('blob');
}

export async function generateInvoice(shipment: Shipment): Promise<Blob> {
  const doc = new jsPDF();

  // Add company logo
  doc.addImage(
    'https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png',
    'PNG',
    10,
    10,
    50,
    20
  );

  // Add invoice header
  doc.setFontSize(24);
  doc.text('INVOICE', 150, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`Invoice #: INV-${shipment.trackingNumber}`, 150, 30, { align: 'right' });
  doc.text(`Date: ${new Date(shipment.createdAt).toLocaleDateString()}`, 150, 35, { align: 'right' });

  // Add billing information
  doc.setFontSize(12);
  doc.text('From:', 10, 50);
  doc.setFontSize(10);
  doc.text(shipment.sender.name, 10, 57);
  doc.text(shipment.sender.phone, 10, 63);
  doc.text(shipment.origin, 10, 69);

  doc.setFontSize(12);
  doc.text('To:', 100, 50);
  doc.setFontSize(10);
  doc.text(shipment.recipient.name, 100, 57);
  doc.text(shipment.recipient.phone, 100, 63);
  doc.text(shipment.destination, 100, 69);

  // Add shipment details
  const startY = 90;
  doc.setFillColor(240, 240, 240);
  doc.rect(10, startY, 190, 10, 'F');
  doc.setFontSize(10);
  doc.text('Description', 15, startY + 7);
  doc.text('Weight (kg)', 80, startY + 7);
  doc.text('Rate', 120, startY + 7);
  doc.text('Amount', 160, startY + 7);

  let currentY = startY + 15;

  if (shipment.weights?.food) {
    doc.text('Food Items', 15, currentY);
    doc.text(shipment.weights.food.toString(), 80, currentY);
    doc.text('€3.00/kg', 120, currentY);
    doc.text(`€${(shipment.weights.food * 3).toFixed(2)}`, 160, currentY);
    currentY += 10;
  }

  if (shipment.weights?.nonFood) {
    doc.text('Non-Food Items', 15, currentY);
    doc.text(shipment.weights.nonFood.toString(), 80, currentY);
    doc.text('€4.90/kg', 120, currentY);
    doc.text(`€${(shipment.weights.nonFood * 4.9).toFixed(2)}`, 160, currentY);
    currentY += 10;
  }

  if (shipment.weights?.hn7) {
    doc.text('HN7 Items', 15, currentY);
    doc.text(shipment.weights.hn7.toString(), 80, currentY);
    doc.text('€7.00/kg', 120, currentY);
    doc.text(`€${(shipment.weights.hn7 * 7).toFixed(2)}`, 160, currentY);
    currentY += 10;
  }

  // Add totals
  currentY += 10;
  doc.line(10, currentY, 200, currentY);
  currentY += 10;

  if (shipment.payment) {
    doc.text('Subtotal (EUR):', 120, currentY);
    doc.text(`€${shipment.payment.baseAmount.toFixed(2)}`, 160, currentY);
    currentY += 7;

    doc.text('Subtotal (XOF):', 120, currentY);
    doc.text(`${Math.round(shipment.payment.baseAmountXOF).toLocaleString()} XOF`, 160, currentY);
    currentY += 7;

    if (shipment.payment.advanceAmount > 0) {
      doc.text('Advance Payment:', 120, currentY);
      doc.text(`€${shipment.payment.advanceAmount.toFixed(2)}`, 160, currentY);
      currentY += 7;

      doc.setTextColor(220, 38, 38);
      doc.text('Balance Due (EUR):', 120, currentY);
      doc.text(`€${shipment.payment.remainingAmount.toFixed(2)}`, 160, currentY);
      currentY += 7;

      doc.text('Balance Due (XOF):', 120, currentY);
      doc.text(`${Math.round(shipment.payment.remainingAmountXOF).toLocaleString()} XOF`, 160, currentY);
    }
  }

  return doc.output('blob');
}