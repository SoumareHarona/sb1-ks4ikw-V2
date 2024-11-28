export interface PDFOptions {
  format?: 'a4' | 'a5' | 'a6';
  orientation?: 'portrait' | 'landscape';
  scale?: number;
}

export const defaultOptions: PDFOptions = {
  format: 'a4',
  orientation: 'portrait',
  scale: 2
};