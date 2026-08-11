# Favicon Directory

Place your favicon files in this directory. The site will automatically load and use larger sizes for better quality.

## Supported Formats
- `.svg` (highest priority - scalable, best quality, modern browsers)
- `.png` (recommended - will be used at 192x192 and larger sizes, also as apple-touch-icon)
- `.ico` (good browser compatibility)
- `.webp` (modern format)

## Recommended Sizes
For best results, use larger favicon files:
- **PNG**: 192x192 pixels or larger (512x512 recommended)
- **SVG**: Any size (scalable, best quality)
- **ICO**: 32x32 or larger (multi-size ICO files supported)

## Usage
Simply place your favicon file(s) in this directory and the site will automatically detect and use it at larger sizes.

## File Priority
If multiple files are present, priority order is:
1. `.svg` (highest priority - best quality)
2. `.png` (good quality, supports multiple sizes)
3. `.ico` (maximum compatibility)
4. `.webp` (modern format)

## Size Support
The site will automatically create multiple size variants:
- 16x16 (standard favicon)
- 32x32 (standard favicon)
- 96x96 (desktop)
- 192x192 (high-DPI displays)
- 512x512 (large displays, PWA)
- 180x180 (Apple touch icon)

