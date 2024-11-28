export interface ValidationErrors {
  [key: string]: string;
}

export function validateForm(form: Record<string, any>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required fields validation
  const requiredFields = [
    { field: 'senderName', label: 'Sender name' },
    { field: 'senderPhone', label: 'Sender phone' },
    { field: 'recipientName', label: 'Recipient name' },
    { field: 'recipientPhone', label: 'Recipient phone' },
    { field: 'packaging', label: 'Packaging information' }
  ];

  requiredFields.forEach(({ field, label }) => {
    if (!form[field]?.trim()) {
      errors[field] = `${label} is required`;
    }
  });

  // Phone number validation
  const phoneFields = ['senderPhone', 'recipientPhone'];
  phoneFields.forEach(field => {
    if (form[field] && !/^\+?[\d\s-]{8,}$/.test(form[field])) {
      errors[field] = 'Please enter a valid phone number';
    }
  });

  // Email validation (if provided)
  if (form.recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipientEmail)) {
    errors.recipientEmail = 'Please enter a valid email address';
  }

  // Numeric fields validation
  const numericFields = [
    'foodWeight',
    'nonFoodWeight',
    'hn7Weight',
    'length',
    'width',
    'height',
    'additionalFeesAmount',
    'advanceAmount'
  ];

  numericFields.forEach(field => {
    if (form[field] && isNaN(parseFloat(form[field]))) {
      errors[field] = 'Please enter a valid number';
    }
    if (form[field] && parseFloat(form[field]) < 0) {
      errors[field] = 'Value cannot be negative';
    }
  });

  return errors;
}