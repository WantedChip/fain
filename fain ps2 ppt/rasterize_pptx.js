// rasterize_pptx.js
// Render each slide HTML at 2x scale via Playwright → PNG, then assemble a
// full-bleed image-background PPTX with pptxgenjs. Fonts, icons, glassmorphism,
// and theme are baked into the images, so the deck looks identical on every
// machine regardless of locally installed fonts.

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const pptxgen = require('pptxgenjs');

// === EDIT THESE PATHS FOR YOUR LAPTOP ===
// Use forward slashes; on Windows use double backslashes or raw strings.
const SLIDES_DIR = './slides';
const IMG_DIR = './slides/_png';
const OUTPUT = './FAIN_Progress_Seminar_II_updated_consistent_theme.pptx';

// Slide is 1280x720 @ 2x for retina-quality PNG (2560x1440)
const SCALE = 2;

async function rasterize() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const htmlFiles = fs.readdirSync(SLIDES_DIR)
    .filter(f => /^slide_\d+\.html$/i.test(f))
    .sort()
    .map(f => path.join(SLIDES_DIR, f));

  console.log(`Found ${htmlFiles.length} slides.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: SCALE,
  });

  for (const htmlFile of htmlFiles) {
    const base = path.basename(htmlFile, '.html');
    const pngPath = path.join(IMG_DIR, `${base}.png`);

    const page = await context.newPage();
    await page.goto('file://' + path.resolve(htmlFile), { waitUntil: 'networkidle', timeout: 30000 });

    // Extra wait for Google Fonts + Material Icons + Tailwind CDN to settle
    await page.waitForTimeout(1500);
    // Ensure fonts are ready
    await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());

    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
      omitBackground: false,
    });
    await page.close();
    console.log(`  ✓ ${base}.png`);
  }

  await browser.close();
  console.log('All slides rasterized.');
}

async function buildPptx() {
  const pngFiles = fs.readdirSync(IMG_DIR)
    .filter(f => /^slide_\d+\.png$/i.test(f))
    .sort()
    .map(f => path.join(IMG_DIR, f));

  console.log(`Assembling PPTX from ${pngFiles.length} images...`);

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 13.333 x 7.5 inches → 1280x720 ratio
  pptx.title = 'FAIN — Progress Seminar';
  pptx.author = 'FAIN Group 16';
  pptx.company = 'Don Bosco Institute of Technology, Mumbai';
  pptx.subject = 'Forest Acoustic Intelligence Network';
  pptx.comment = 'Rasterized for cross-platform visual fidelity';

  for (const png of pngFiles) {
    const slide = pptx.addSlide();
    slide.background = { path: png }; // full-bleed image background

    const base = path.basename(png, '.png');
    // Add clickable overlay for Slide 15 simulation web app banner
    if (base === 'slide_15') {
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.58,
        y: 1.33,
        w: 12.17,
        h: 0.77,
        fill: { color: 'FFFFFF', transparency: 100 },
        line: { color: 'FFFFFF', transparency: 100 },
        hyperlink: {
          url: 'https://fain.sohamlabs.workers.dev',
          tooltip: 'Launch FAIN Cloud Simulation (https://fain.sohamlabs.workers.dev)'
        }
      });
    }
  }

  let targetOutput = OUTPUT;
  try {
    await pptx.writeFile({ fileName: targetOutput });
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackOutput = './FAIN_Progress_Seminar_II_latest.pptx';
      console.warn(`\n[NOTE] ${OUTPUT} is currently open or locked in another application.`);
      console.warn(`Saving to ${fallbackOutput} instead...\n`);
      targetOutput = fallbackOutput;
      await pptx.writeFile({ fileName: targetOutput });
    } else {
      throw err;
    }
  }
  const stat = fs.statSync(targetOutput);
  console.log(`Saved: ${targetOutput} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
}

(async () => {
  try {
    if (process.argv.includes('--build-only')) {
      console.log('Skipping rasterization (--build-only flag detected)...');
      await buildPptx();
    } else {
      await rasterize();
      await buildPptx();
    }
    console.log('Done.');
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
