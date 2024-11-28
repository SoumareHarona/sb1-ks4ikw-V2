import { Font } from '@react-pdf/renderer';

export async function setupFonts(): Promise<HTMLStyleElement> {
  // Register fonts for PDF generation
  await Font.register({
    family: 'Inter',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
        fontWeight: 400 
      },
      { 
        src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7.woff2',
        fontWeight: 700 
      }
    ]
  });

  // Add required fonts to document
  const fontStyle = document.createElement('style');
  fontStyle.setAttribute('data-pdf-fonts', '');
  fontStyle.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    * { font-family: 'Inter', Arial, sans-serif !important; }
  `;
  document.head.appendChild(fontStyle);

  return fontStyle;
}