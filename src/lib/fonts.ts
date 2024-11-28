import { Font } from '@react-pdf/renderer';

// Font loading status tracking
let fontsLoaded = false;

// Register fonts for PDF generation
export async function registerFonts() {
  if (fontsLoaded) return true;

  try {
    // Register fonts with fallbacks
    await Font.register({
      family: 'Inter',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
          fontStyle: 'normal',
          fontWeight: 400,
          format: 'woff2',
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7.woff2',
          fontStyle: 'normal',
          fontWeight: 700,
          format: 'woff2',
        },
      ],
      fallback: true,
    });

    // Verify fonts are loaded
    await Font.load({ family: 'Inter' });
    
    fontsLoaded = true;
    return true;
  } catch (error) {
    console.error('Error loading fonts:', error);
    // Use system fonts as fallback
    await Font.register({
      family: 'Inter',
      fonts: [
        { src: 'fonts/Arial.ttf', fontWeight: 400 },
        { src: 'fonts/Arial-Bold.ttf', fontWeight: 700 }
      ],
      fallback: true
    });
    throw new Error('Failed to load preferred fonts, using system fonts');
  }
}

// Check if fonts are loaded
export function areFontsLoaded() {
  return fontsLoaded;
}