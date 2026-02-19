// Utility to load favicon from src/Logo/favicon/
export function loadFavicon() {
  // Try to load favicon dynamically
  const faviconModules = import.meta.glob('../Logo/favicon/*.{ico,png,svg,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const faviconEntries = Object.entries(faviconModules || {});
  
  if (faviconEntries.length > 0) {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Sort by size preference: prefer larger sizes (svg > png > ico > webp)
    const sortedFavicons = faviconEntries.sort(([pathA], [pathB]) => {
      const extA = pathA.split('.').pop()?.toLowerCase() || '';
      const extB = pathB.split('.').pop()?.toLowerCase() || '';
      const priority: Record<string, number> = { svg: 4, png: 3, ico: 2, webp: 1 };
      return (priority[extB] || 0) - (priority[extA] || 0);
    });
    
    // Use the first (highest priority) favicon
    const [faviconPath, faviconUrl] = sortedFavicons[0];
    
    // Determine file type and size
    const extension = faviconPath.split('.').pop()?.toLowerCase();
    let type = 'image/x-icon';
    let sizes = '32x32';
    
    if (extension === 'png') {
      type = 'image/png';
      sizes = '192x192'; // Larger size for better quality
    } else if (extension === 'svg') {
      type = 'image/svg+xml';
      sizes = 'any'; // SVG is scalable
    } else if (extension === 'webp') {
      type = 'image/webp';
      sizes = '192x192';
    } else if (extension === 'ico') {
      type = 'image/x-icon';
      sizes = '32x32';
    }
    
    // Create and append new favicon link with larger size
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = type;
    link.href = faviconUrl;
    link.sizes = sizes;
    document.head.appendChild(link);
    
    // Add multiple sizes for better browser support
    if (extension === 'png' || extension === 'ico') {
      // Add standard sizes
      const sizesToAdd = [
        { size: '16x16', rel: 'icon' },
        { size: '32x32', rel: 'icon' },
        { size: '96x96', rel: 'icon' },
        { size: '192x192', rel: 'icon' },
        { size: '512x512', rel: 'icon' },
      ];
      
      sizesToAdd.forEach(({ size, rel }) => {
        const sizeLink = document.createElement('link');
        sizeLink.rel = rel;
        sizeLink.type = type;
        sizeLink.href = faviconUrl;
        sizeLink.sizes = size;
        document.head.appendChild(sizeLink);
      });
    }
    
    // Also add apple-touch-icon for iOS devices (larger size)
    if (extension === 'png' || extension === 'svg') {
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = faviconUrl;
      appleLink.sizes = '180x180';
      document.head.appendChild(appleLink);
    }
    
    // Add manifest icon for PWA support
    if (extension === 'png') {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = faviconUrl;
      document.head.appendChild(manifestLink);
    }
  }
}

