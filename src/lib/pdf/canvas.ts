import html2canvas from 'html2canvas';
import type { PDFOptions } from './types';

export async function generateCanvas(
  element: HTMLElement, 
  fontStyle: HTMLStyleElement, 
  options: PDFOptions
): Promise<HTMLCanvasElement> {
  let canvas: HTMLCanvasElement | null = null;
  let attempts = 0;
  const maxAttempts = 3;

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
          resolve(); // Continue without the image
        };
      }
    }))
  );

  while (!canvas && attempts < maxAttempts) {
    try {
      canvas = await html2canvas(element, {
        scale: options.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = fontStyle.textContent;
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

  return canvas;
}