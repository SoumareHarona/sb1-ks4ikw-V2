import QRCode from 'qrcode';

export async function generateQRCode(data) {
  try {
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}