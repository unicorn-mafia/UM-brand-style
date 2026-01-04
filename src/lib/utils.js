// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Download file
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert SVG to PNG/JPG
export async function convertSvgToImage(svgPath, format = 'png', size = 1024, isDark = false) {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    
    const img = new Image();
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Set background for JPG
        if (format === 'jpg') {
          ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
          ctx.fillRect(0, 0, size, size);
        }
        
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        
        canvas.toBlob(
          (blob) => resolve(blob),
          format === 'jpg' ? 'image/jpeg' : 'image/png',
          0.95
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error('Error converting SVG:', error);
    throw error;
  }
}

