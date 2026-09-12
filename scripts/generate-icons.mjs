import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lengthBuf, toCrc, crcBuf]);
}

function createIconPNG(width, height) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // adaptive filter
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image data: GradeForge Academic Blue background with rounded feel
  // Color palette: Brand Blue #246BCE (36, 107, 206), Amber #F4B942 (244, 185, 66)
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter byte: none

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const nx = x / width;
      const ny = y / height;

      // Draw Academic Cap / Graph Steps in center
      // Background: #F7FAFC (247, 250, 252)
      let r = 247, g = 250, b = 252, a = 255;

      // Outer border radius check
      const cornerRadius = 0.22;
      const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerRadius));
      const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerRadius));
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > cornerRadius) {
        // Transparent outside rounded box
        a = 0;
      } else {
        // Stepped graph lines: #246BCE (36, 107, 206)
        // Step 1: x in [0.2, 0.4], y in [0.6, 0.75]
        // Step 2: x in [0.4, 0.6], y in [0.45, 0.75]
        // Step 3: x in [0.6, 0.8], y in [0.3, 0.75]
        if (
          (nx >= 0.18 && nx <= 0.38 && ny >= 0.60 && ny <= 0.75) ||
          (nx >= 0.38 && nx <= 0.58 && ny >= 0.42 && ny <= 0.75) ||
          (nx >= 0.58 && nx <= 0.78 && ny >= 0.25 && ny <= 0.75)
        ) {
          r = 36; g = 107; b = 206;
        }

        // Ascending diagonal arrow: #F4B942 (244, 185, 66)
        const lineDist = Math.abs((1 - ny) - (nx * 0.9 + 0.05));
        if (lineDist < 0.035 && nx >= 0.2 && nx <= 0.82) {
          r = 244; g = 185; b = 66;
        }

        // Top node circle: #D95656 (217, 86, 86)
        const cdx = nx - 0.82;
        const cdy = ny - 0.22;
        if (cdx * cdx + cdy * cdy < 0.003) {
          r = 217; g = 86; b = 86;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createIconPNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createIconPNG(512, 512));
console.log('Successfully generated public/icons/icon-192.png and public/icons/icon-512.png');
