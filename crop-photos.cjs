const { Jimp } = require('jimp');
const path = require('path');
const fs   = require('fs');

const SRC = 'C:\\Users\\poltr\\OneDrive\\Escriptori\\northstar\\';
const OUT = path.join(__dirname, 'public', 'assets', 'photos');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// type 'portrait' => crop Instagram UI, keep photo area
// type 'square'   => same crop then center-square
const jobs = [
  { src: 'WhatsApp Image 2026-05-12 at 22.25.12.jpeg',       out: 'editorial-01.jpg', type: 'portrait' },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.16 (5).jpeg',   out: 'editorial-02.jpg', type: 'portrait' },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.15 (8).jpeg',   out: 'editorial-03.jpg', type: 'portrait' },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.14 (3).jpeg',   out: 'editorial-04.jpg', type: 'portrait' },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.15 (6).jpeg',   out: 'editorial-05.jpg', type: 'portrait' },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.13 (1).jpeg',   out: 'feed-01.jpg',      type: 'square'   },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.14 (4).jpeg',   out: 'feed-02.jpg',      type: 'square'   },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.13 (6).jpeg',   out: 'feed-03.jpg',      type: 'square'   },
  { src: 'WhatsApp Image 2026-05-12 at 22.25.15 (9).jpeg',   out: 'feed-04.jpg',      type: 'square'   },
];

async function run() {
  for (const job of jobs) {
    const srcPath = SRC + job.src;
    const outPath = path.join(OUT, job.out);
    let img;
    try {
      img = await Jimp.read(srcPath);
    } catch (e) {
      console.error(`SKIP ${job.src}: ${e.message}`);
      continue;
    }

    const W = img.width;
    const H = img.height;

    // Instagram screenshot structure (percentages, at 739×1600):
    //   top UI (status bar + IG nav + post header): ~17.5%  = ~280px
    //   photo area (4:5 portrait = 924px):          ~57.8%  = ~924px
    //   bottom UI (dots + interactions + caption):  rest
    const topSkip = Math.floor(H * 0.175);
    const photoH  = Math.floor(H * 0.575);

    img.crop({ x: 0, y: topSkip, w: W, h: photoH });

    if (job.type === 'square') {
      const W2   = img.width;
      const H2   = img.height;
      const size = Math.min(W2, H2);
      const sx   = Math.floor((W2 - size) / 2);
      const sy   = Math.floor((H2 - size) / 2);
      img.crop({ x: sx, y: sy, w: size, h: size });
    }

    await img.write(outPath);
    console.log(`✓ ${job.out}  (${W}×${H} → ${img.width}×${img.height})`);
  }
  console.log('Done.');
}

run().catch(console.error);
