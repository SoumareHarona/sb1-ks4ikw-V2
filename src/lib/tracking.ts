import { z } from 'zod';
import type { FreightMode, Country } from '../types';

const countryCodeMap: Record<Country, string> = {
  'France': 'FR',
  'Mali': 'ML',
  'Senegal': 'SN',
  'Gambia': 'GM'
};

const trackingNumberSchema = z.object({
  originCode: z.string().length(2),
  destinationCode: z.string().length(2),
  identifier: z.literal('FRET'),
  sequentialNumber: z.string().length(4).regex(/^\d+$/),
  uniqueId: z.string().length(4).regex(/^[A-Z0-9]+$/)
});

export type TrackingNumber = z.infer<typeof trackingNumberSchema>;

export function generateTrackingNumber(origin: Country, destination: Country, freightNumber: string, mode: FreightMode): string {
  const originCode = countryCodeMap[origin];
  const destinationCode = countryCodeMap[destination];
  const sequentialNumber = freightNumber.padStart(4, '0');
  const uniqueId = generateUniqueId(mode);

  return `${originCode}-${destinationCode}-FRET-${sequentialNumber}-${uniqueId}`;
}

function generateUniqueId(mode: FreightMode): string {
  const modePrefix = mode === 'air' ? 'A' : mode === 'sea' ? 'S' : 'G';
  const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let uniqueId = modePrefix;
  
  for (let i = 0; i < 3; i++) {
    uniqueId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  
  return uniqueId;
}

export function validateTrackingNumber(trackingNumber: string): boolean {
  try {
    const [originPart, destinationPart, identifierPart, numberPart, uniquePart] = trackingNumber.split('-');
    
    if (!originPart || !destinationPart || identifierPart !== 'FRET' || !numberPart || !uniquePart) {
      return false;
    }

    const parsed = trackingNumberSchema.parse({
      originCode: originPart,
      destinationCode: destinationPart,
      identifier: identifierPart as 'FRET',
      sequentialNumber: numberPart,
      uniqueId: uniquePart
    });

    // Validate country codes
    if (!Object.values(countryCodeMap).includes(originPart) || 
        !Object.values(countryCodeMap).includes(destinationPart)) {
      return false;
    }

    // Validate sequential number format
    if (!/^\d{4}$/.test(numberPart)) {
      return false;
    }

    // Validate unique ID format (mode prefix + 3 alphanumeric)
    if (!/^[ASG][A-Z0-9]{3}$/.test(uniquePart)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function parseTrackingNumber(trackingNumber: string): TrackingNumber | null {
  try {
    const [originPart, destinationPart, identifierPart, numberPart, uniquePart] = trackingNumber.split('-');
    
    if (identifierPart !== 'FRET') {
      return null;
    }

    return {
      originCode: originPart,
      destinationCode: destinationPart,
      identifier: 'FRET',
      sequentialNumber: numberPart,
      uniqueId: uniquePart
    };
  } catch (error) {
    return null;
  }
}

export function getTrackingUrl(trackingNumber: string): string {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  return `${baseUrl}/track/${trackingNumber}`;
}

export function formatFreightNumber(origin: Country, number: string): string {
  const countryCode = countryCodeMap[origin];
  const paddedNumber = number.toString().padStart(4, '0');
  return `${countryCode}-FRET-${paddedNumber}`;
}