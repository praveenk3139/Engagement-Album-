import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Exact ordered list of spreads
const currentList = [
  '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
  '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
  '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg',
  // Page 36: Untitled design (1).jpg
  'Untitled design (1).jpg',
  // Page 37 onwards:
  '36.jpg', '37.jpg', '38.jpg', '39.jpg', '40.jpg', '41.jpg', '42.jpg',
  '43.jpg.jpeg', '44.jpg', '45.jpg', '45a.jpg.jpeg', '46.jpg', '47.jpg', '48.jpg'
];

console.log(`Processing ${currentList.length} files...`);

// Step 1: Verify all files exist
for (const file of currentList) {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${file}`);
    process.exit(1);
  }
}

// Step 2: Rename all to unique temporary names to avoid collision
const tempMappings = [];
for (let i = 0; i < currentList.length; i++) {
  const original = currentList[i];
  const originalPath = path.join(rootDir, original);
  const tempName = `__temp_spread_${i + 1}_${Date.now()}__.jpg`;
  const tempPath = path.join(rootDir, tempName);
  
  fs.renameSync(originalPath, tempPath);
  tempMappings.push({
    tempPath,
    targetName: `${String(i + 1).padStart(2, '0')}.jpg`
  });
}

// Step 3: Rename from temp names to final target names (01.jpg .. 50.jpg)
for (const { tempPath, targetName } of tempMappings) {
  const targetPath = path.join(rootDir, targetName);
  fs.renameSync(tempPath, targetPath);
  console.log(`Created: ${targetName}`);
}

console.log('All 50 pages re-ordered and renamed successfully!');
