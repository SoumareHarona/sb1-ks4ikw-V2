import { jsPDF } from 'jspdf';
import { Font } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

// Register fonts for PDF generation
Font.register({
  family: 'Inter',
  fonts: [
    { 
      src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
      fontWeight: 400 
    },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7.woff2',
      fontWeight: 700 
    }
  ]
});

interface PDFOptions {
  format?: 'a4' | 'a5' | 'a6';
  orientation?: 'portrait' | 'landscape';
  scale?: number;
}

const defaultOptions: PDFOptions = {
  format: 'a4',
  orientation: 'portrait',
  scale: 2
};

export async function generatePDF(element: HTMLElement, options: PDFOptions = {}): Promise<Blob> {
  const mergedOptions = { ...defaultOptions, ...options };
  let fontStyle: HTMLStyleElement | null = null;
  
  try {
    // Add required fonts
    fontStyle = document.createElement('style');
    fontStyle.setAttribute('data-pdf-fonts', '');
    fontStyle.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      * { font-family: 'Inter', Arial, sans-serif !important; }
    `;
    document.head.appendChild(fontStyle);

    // Wait for fonts to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500)); // Extra delay for font loading

    // Wait for images to load
    const images = Array.from(element.getElementsByTagName('img'));
    await Promise.all(
      images.map(img => new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.src = ''; // Clear source to prevent broken image
            resolve();
          };
        }
      }))
    );

    // Generate canvas with retries
    let canvas: HTMLCanvasElement | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!canvas && attempts < maxAttempts) {
      try {
        canvas = await html2canvas(element, {
          scale: mergedOptions.scale,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement('style');
            style.textContent = fontStyle?.textContent || '';
            clonedDoc.head.appendChild(style);
          }
        });
      } catch (error) {
        attempts++;
        console.warn(`Canvas generation attempt ${attempts} failed:`, error);
        if (attempts === maxAttempts) {
          throw new Error('Failed to generate canvas after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!canvas) {
      throw new Error('Failed to generate canvas');
    }

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: mergedOptions.orientation,
      unit: 'mm',
      format: mergedOptions.format,
      compress: true,
      putOnlyUsedFonts: true,
      hotfixes: ['px_scaling']
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const widthRatio = pdfWidth / canvas.width;
    const heightRatio = pdfHeight / canvas.height;
    const ratio = Math.min(widthRatio, heightRatio);
    
    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;
    
    const marginX = (pdfWidth - canvasWidth) / 2;
    const marginY = (pdfHeight - canvasHeight) / 2;

    // Add image to PDF with quality settings
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', marginX, marginY, canvasWidth, canvasHeight, undefined, 'FAST');

    // Generate blob with compression
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Failed to generate PDF. Please try again.');
    throw new Error(
      error instanceof Error 
        ? `Failed to generate PDF: ${error.message}`
        : 'Failed to generate PDF'
    );
  } finally {
    // Cleanup
    if (fontStyle && fontStyle.parentNode) {
      fontStyle.parentNode.removeChild(fontStyle);
    }
  }
}