/**
 * Client-side image compressor & processor for uploaded product photos.
 * Converts uploaded photos from device camera/gallery into lightweight, high-fidelity
 * base64 Data URLs so they persist seamlessly in storage without quota issues.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export async function processImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WEBP, etc.)'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from your device'));
    };

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Could not parse image data'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate aspect-ratio scaling
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to raw data url if canvas context unavailable
            const rawDataUrl = readerEvent.target?.result as string;
            resolve({
              dataUrl: rawDataUrl,
              fileName: file.name,
              originalSize: file.size,
              compressedSize: rawDataUrl.length,
              width: img.width,
              height: img.height
            });
            return;
          }

          // Enable smooth anti-aliased image resizing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // White background fallback for transparent PNGs if converted to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Use webp if supported, or jpeg
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Calculate approximate byte size of base64
          const compressedSize = Math.round((dataUrl.length * 3) / 4);

          resolve({
            dataUrl,
            fileName: file.name,
            originalSize: file.size,
            compressedSize,
            width,
            height
          });
        } catch (err) {
          // If canvas processing fails, fallback to raw reader result
          const rawDataUrl = readerEvent.target?.result as string;
          resolve({
            dataUrl: rawDataUrl,
            fileName: file.name,
            originalSize: file.size,
            compressedSize: rawDataUrl.length,
            width: img.width || 800,
            height: img.height || 800
          });
        }
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
