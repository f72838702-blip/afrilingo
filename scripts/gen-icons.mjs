// Génère les icônes PNG du manifest PWA sans dépendance (pure JS + zlib Node).
// Marque : carré doré arrondi + cercle terracotta centré (évocation bazin/soleil).
// Lance : node scripts/gen-icons.mjs
import zlib from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// RGBA → PNG
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // Ajoute un filtre 0 (None) en tête de chaque ligne
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function hexToRGB(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function makeIcon(size, { rounded = true, maskable = false }) {
  const rgba = Buffer.alloc(size * size * 4);
  const gold = hexToRGB("#f2c14e");
  const goldDeep = hexToRGB("#e0a93a");
  const terr = hexToRGB("#c0703f");
  const dark = hexToRGB("#0a0a12");
  const r = rounded ? Math.round(size * 0.205) : 0; // rayon des coins
  const cx = size / 2;
  const cy = size / 2;
  // Pour maskable : la marque centrale reste dans la zone safe (centre 40%).
  const markR = maskable ? size * 0.26 : size * 0.28;
  const ring = markR * 0.42;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Distance au coin le plus proche pour le masque arrondi
      let inside = true;
      if (rounded) {
        const dx = Math.max(r - x, x - (size - 1 - r), 0);
        const dy = Math.max(r - y, y - (size - 1 - r), 0);
        if (dx * dx + dy * dy > r * r) inside = false;
      }
      if (!inside) {
        // transparent (ou fond pour maskable full-bleed — on remplit quand même)
        rgba[i] = maskable ? gold[0] : 0;
        rgba[i + 1] = maskable ? gold[1] : 0;
        rgba[i + 2] = maskable ? gold[2] : 0;
        rgba[i + 3] = maskable ? 255 : 0;
        continue;
      }
      // Dégradé diagonal doux gold -> goldDeep
      const t = (x + y) / (2 * size);
      let [cr, cg, cb] = [
        Math.round(gold[0] * (1 - t) + goldDeep[0] * t),
        Math.round(gold[1] * (1 - t) + goldDeep[1] * t),
        Math.round(gold[2] * (1 - t) + goldDeep[2] * t),
      ];
      // Cercle terracotta central
      const d = Math.hypot(x - cx, y - cy);
      if (d < markR) {
        const sh = d / markR; // 0 centre -> 1 bord
        cr = Math.round(terr[0] * (1 - sh * 0.25));
        cg = Math.round(terr[1] * (1 - sh * 0.25));
        cb = Math.round(terr[2] * (1 - sh * 0.25));
      } else if (d < markR + 3) {
        // liseré fin
        cr = dark[0];
        cg = dark[1];
        cb = dark[2];
      }
      // Anneau doré interne (halo) autour de la marque
      if (Math.abs(d - (markR + ring)) < size * 0.012 && d > markR + 3) {
        const a = 1 - Math.abs(d - (markR + ring)) / (size * 0.012);
        cr = Math.round(cr * (1 - a) + 255 * a * 0.9 + cr * 0);
        cg = Math.round(cg * (1 - a) + 230 * a);
        cb = Math.round(cb * (1 - a) + 140 * a);
      }
      rgba[i] = cr;
      rgba[i + 1] = cg;
      rgba[i + 2] = cb;
      rgba[i + 3] = 255;
    }
  }
  return encodePNG(size, size, rgba);
}

mkdirSync("public", { recursive: true });
writeFileSync("public/icon-192.png", makeIcon(192, { rounded: true }));
writeFileSync("public/icon-512.png", makeIcon(512, { rounded: true }));
writeFileSync(
  "public/icon-maskable-512.png",
  makeIcon(512, { rounded: false, maskable: true })
);
console.log("Icônes générées : public/icon-192.png, icon-512.png, icon-maskable-512.png");