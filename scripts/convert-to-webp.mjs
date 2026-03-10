import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const imagesDir = new URL('../public/images', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = await readdir(imagesDir);
const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

console.log(`Found ${imageFiles.length} images to convert`);

let totalSaved = 0;

for (const file of imageFiles) {
  const inputPath = join(imagesDir, file);
  const outputPath = join(imagesDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

  try {
    const inputStat = await stat(inputPath);
    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
    const outputStat = await stat(outputPath);
    const saved = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
    totalSaved += inputStat.size - outputStat.size;
    console.log(`  ${file} -> .webp (${saved}% smaller)`);
  } catch (err) {
    console.error(`  ERROR: ${file}: ${err.message}`);
  }
}

console.log(`\nDone! Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
