# Favicon Files

## 📁 Required Files

This directory needs the following PNG favicon files:

1. **favicon-16x16.png** - 16x16 pixels
2. **favicon-32x32.png** - 32x32 pixels  
3. **apple-touch-icon.png** - 180x180 pixels

## 🎨 Quick Generation

### **Option 1: Use Favicon.io (Easiest - 2 minutes)**

1. Go to: https://favicon.io/favicon-generator/
2. Settings:
   - Text: `M`
   - Background: `Rounded`
   - Font: `Arial` or `Roboto`
   - Font Size: `80`
   - Background Color: `#FF6B35`
   - Font Color: `#FFFFFF`
3. Click "Download"
4. Extract and copy these 3 files here:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`

### **Option 2: Use This SVG**

Convert `favicon.svg` (in this folder) to PNG using:
- https://cloudconvert.com/svg-to-png
- Or any image editor (Figma, Photoshop, GIMP)

Export at these sizes:
- 16x16px
- 32x32px
- 180x180px

## ✅ After Adding Files

```bash
git add frontend/public/*.png
git commit -m "Add favicon PNG files"
git push
```

Vercel will auto-deploy and favicon will appear in browser tabs!
