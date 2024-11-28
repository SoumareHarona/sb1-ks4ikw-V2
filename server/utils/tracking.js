import { v4 as uuidv4 } from 'uuid';

const countryCodeMap = {
  'France': 'FR',
  'Mali': 'ML',
  'Senegal': 'SN',
  'Gambia': 'GM'
};

export function generateTrackingNumber(origin, destination, freightNumber, mode) {
  // Format: {ORIGIN}-{DESTINATION}-FRET-{NUMBER}-{ID}
  // Example: ML-FR-FRET-0001-A123
  const originCode = countryCodeMap[origin];
  const destinationCode = countryCodeMap[destination];
  const sequentialNumber = freightNumber.toString().padStart(4, '0');
  const uniqueId = generateUniqueId(mode);

  return `${originCode}-${destinationCode}-FRET-${sequentialNumber}-${uniqueId}`;
}

function generateUniqueId(mode) {
  const modePrefix = mode === 'air' ? 'A' : mode === 'sea' ? 'S' : 'G';
  const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let uniqueId = modePrefix;
  
  for (let i = 0; i < 3; i++) {
    uniqueId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  
  return uniqueId;
}

export function validateTrackingNumber(trackingNumber) {
  try {
    const [originCode, destinationCode, fret, number, uniqueId] = trackingNumber.split('-');
    
    // Validate format
    if (!originCode || !destinationCode || fret !== 'FRET' || !number || !uniqueId) {
      return false;
    }

    // Validate country codes
    if (!Object.values(countryCodeMap).includes(originCode) || 
        !Object.values(countryCodeMap).includes(destinationCode)) {
      return false;
    }

    // Validate sequential number format (4 digits)
    if (!/^\d{4}$/.test(number)) {
      return false;
    }

    // Validate unique ID format (mode prefix + 3 alphanumeric)
    if (!/^[ASG][A-Z0-9]{3}$/.test(uniqueId)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function formatFreightNumber(origin, number) {
  const countryCode = countryCodeMap[origin];
  const paddedNumber = number.toString().padStart(4, '0');
  return `${countryCode}-FRET-${paddedNumber}`;
}