import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

// Read files in root directory
const allFiles = fs.readdirSync(rootDir);

const imageFiles = allFiles.filter(file => {
  const lower = file.toLowerCase();
  if (lower.startsWith('untitled') || lower.startsWith('__temp')) return false;
  return validExts.some(ext => lower.endsWith(ext));
});

// Identify cover photo and sort spreads naturally
const coverFile = imageFiles.find(f => f.toUpperCase().includes('0O0A5313')) || imageFiles[0];
const spreadFiles = imageFiles.filter(f => f !== coverFile);

spreadFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const sheets = spreadFiles.map((filename, index) => {
  return {
    id: `sheet-${index + 1}`,
    index: index + 1,
    sheetNumber: index + 1,
    filename: filename,
    src: `/album/${filename}`,
    thumbSrc: `/album/thumbnails/${filename}`,
    title: `Spread ${String(index + 1).padStart(2, '0')}`,
    caption: `Sacred Engagement Celebration — Sheet ${index + 1} (Optimized Spread)`
  };
});

const albumData = {
  title: "Ramya & Saravanan's Engagement Album",
  couple: "Ramya & Saravanan",
  subtitle: "Two Hearts • One Beautiful Beginning",
  date: "31 August 2026",
  location: "Sacred Engagement Ceremony & Celebration",
  coverImage: {
    filename: coverFile,
    src: `/album/${coverFile}`,
    thumbSrc: `/album/thumbnails/${coverFile}`
  },
  aspectRatio: "3:1 (10800x3600)",
  totalSheets: sheets.length,
  totalImages: sheets.length,
  sheets: sheets,
  images: sheets
};

const srcDir = path.join(rootDir, 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

fs.writeFileSync(
  path.join(srcDir, 'albumData.json'),
  JSON.stringify(albumData, null, 2),
  'utf-8'
);

const tsContent = `// Auto-generated album data manifest (Web-Optimized 3:1 Spreads)
export interface AlbumImage {
  id: string;
  index: number;
  sheetNumber?: number;
  filename: string;
  src: string;
  thumbSrc?: string;
  title: string;
  caption: string;
}

export interface AlbumConfig {
  title: string;
  couple: string;
  subtitle: string;
  date: string;
  location: string;
  coverImage: {
    filename: string;
    src: string;
    thumbSrc?: string;
  };
  aspectRatio: string;
  totalSheets: number;
  totalImages: number;
  sheets: AlbumImage[];
  images: AlbumImage[];
}

export const albumData: AlbumConfig = ${JSON.stringify(albumData, null, 2)};
`;

fs.writeFileSync(path.join(srcDir, 'albumData.ts'), tsContent, 'utf-8');

// Ensure public/album and public/album/thumbnails directories exist
const publicAlbumDir = path.join(rootDir, 'public', 'album');
const publicThumbDir = path.join(publicAlbumDir, 'thumbnails');

if (!fs.existsSync(publicAlbumDir)) {
  fs.mkdirSync(publicAlbumDir, { recursive: true });
}
if (!fs.existsSync(publicThumbDir)) {
  fs.mkdirSync(publicThumbDir, { recursive: true });
}

// Clean orphaned files in public/album
const existingPublicFiles = fs.readdirSync(publicAlbumDir);
for (const f of existingPublicFiles) {
  if (f !== 'thumbnails' && !imageFiles.includes(f)) {
    try { fs.unlinkSync(path.join(publicAlbumDir, f)); } catch {}
  }
}

// Optimize all 10800x3600 images for fast web viewing
console.log(`Starting image optimization for ${imageFiles.length} photos...`);
let processed = 0;
let skipped = 0;

async function processImage(filename) {
  const srcPath = path.join(rootDir, filename);
  const destPath = path.join(publicAlbumDir, filename);
  const thumbPath = path.join(publicThumbDir, filename);

  const srcStat = fs.statSync(srcPath);

  // Check if main already resized to <= 3000px and thumbnail exists
  let needsMain = true;
  let needsThumb = true;

  if (fs.existsSync(destPath)) {
    const destStat = fs.statSync(destPath);
    // If destination file size is < 2MB (indicates it's compressed, not raw 10MB-30MB)
    if (destStat.size < 2000000 && destStat.mtimeMs >= srcStat.mtimeMs) {
      needsMain = false;
    }
  }

  if (fs.existsSync(thumbPath)) {
    const thumbStat = fs.statSync(thumbPath);
    if (thumbStat.size < 300000 && thumbStat.mtimeMs >= srcStat.mtimeMs) {
      needsThumb = false;
    }
  }

  if (!needsMain && !needsThumb) {
    skipped++;
    return;
  }

  // Optimize main image to max width 3000px (e.g. 3000x1000 for 3:1 spread), JPEG quality 85, progressive
  if (needsMain) {
    const tempMainPath = path.join(publicAlbumDir, `__temp_${filename}.jpg`);
    await sharp(srcPath)
      .resize({ width: 3000, withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true, mozjpeg: true })
      .toFile(tempMainPath);
    fs.renameSync(tempMainPath, destPath);
  }

  // Create thumbnail (width 600px, e.g. 600x200 for 3:1 spread)
  if (needsThumb) {
    const tempThumbPath = path.join(publicThumbDir, `__temp_${filename}.jpg`);
    await sharp(srcPath)
      .resize({ width: 600, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(tempThumbPath);
    fs.renameSync(tempThumbPath, thumbPath);
  }

  processed++;
  if (processed % 10 === 0 || processed === imageFiles.length) {
    console.log(`  Optimized ${processed}/${imageFiles.length} images...`);
  }
}

async function run() {
  const t0 = Date.now();
  const concurrency = 4;
  for (let i = 0; i < imageFiles.length; i += concurrency) {
    const chunk = imageFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(processImage));
  }
  const totalTime = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`Image optimization complete in ${totalTime}s (Processed: ${processed}, Cached: ${skipped}, Total: ${imageFiles.length}).`);
}

await run();
