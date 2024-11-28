export async function sendNotification(phone, message) {
  if (!phone) {
    console.warn('No phone number provided for notification');
    return;
  }

  // For development, just log the notification
  console.log('[NOTIFICATION] To:', phone, 'Message:', message);
  return true;
}