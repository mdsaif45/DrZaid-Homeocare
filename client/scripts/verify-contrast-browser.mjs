import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.dirname(__dirname);
const distDir = path.join(clientDir, 'dist');
const distLandingDir = path.join(clientDir, 'dist-landing');

// MIME types helper
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
};

// Static server serving SPA dist and Landing dist-landing
function startServer(port = 4173) {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    let filePath;
    if (urlPath.startsWith('/landing')) {
      const relPath = urlPath.replace('/landing', '') || '/index.html';
      filePath = path.join(distLandingDir, relPath);
    } else {
      filePath = path.join(distDir, urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

// In-browser WCAG 2.1 contrast evaluation function
const EVALUATE_DOM_CONTRAST = () => {
  function parseRgb(colorStr) {
    if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') return null;
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
    if (alpha === 0) return null;
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), alpha };
  }

  function getLuminance({ r, g, b }) {
    const [rL, gL, bL] = [r, g, b].map((val) => {
      const s = val / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  }

  function getContrastRatio(rgb1, rgb2) {
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function getEffectiveBg(el) {
    let current = el;
    while (current && current !== document.documentElement) {
      const style = window.getComputedStyle(current);
      const bg = parseRgb(style.backgroundColor);
      if (bg && bg.alpha > 0.9) return bg;
      current = current.parentElement;
    }
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const htmlBg = parseRgb(htmlStyle.backgroundColor);
    if (htmlBg) return htmlBg;
    return { r: 255, g: 255, b: 255, alpha: 1 };
  }

  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();
    if (!text || text.length === 0) continue;

    const parent = node.parentElement;
    if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.ariaHidden === 'true') continue;

    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const style = window.getComputedStyle(parent);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;

    const fgRgb = parseRgb(style.color);
    if (!fgRgb) continue;

    const bgRgb = getEffectiveBg(parent);
    const ratio = getContrastRatio(fgRgb, bgRgb);

    const fontSizePx = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight) || 400;
    const isLarge = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
    const requiredRatio = isLarge ? 3.0 : 4.5;

    results.push({
      text: text.substring(0, 35),
      tagName: parent.tagName,
      fg: style.color,
      bg: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
      ratio: Number(ratio.toFixed(2)),
      requiredRatio,
      passed: ratio >= requiredRatio,
    });
  }

  return results;
};

// Main verification runner
async function runRealBrowserAudit() {
  console.log('=== RUNNING PLAYWRIGHT REAL-BROWSER WCAG 2.1 CONTRAST SWEEP ===\n');

  const PORT = 4173;
  const server = await startServer(PORT);
  const baseUrl = `http://localhost:${PORT}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const routes = [
    { name: 'SPA Home', path: '/' },
    { name: 'SPA Login', path: '/login' },
    { name: 'SPA Dashboard', path: '/dashboard' },
    { name: 'SPA Patients List', path: '/dashboard/patients' },
    { name: 'SPA Patient Detail', path: '/dashboard/patients/1' },
    { name: 'SPA New Patient', path: '/dashboard/patients/new' },
    { name: 'SPA New Case Record', path: '/dashboard/case-records/new' },
    { name: 'SPA New Prescription', path: '/dashboard/prescriptions/new' },
    { name: 'Landing Consultant', path: '/landing/index.html' },
  ];

  let totalNodesEvaluated = 0;
  const allFailures = [];

  for (const routeObj of routes) {
    const page = await context.newPage();

    // Stub API network requests for dashboard routes
    await page.route('**/api/**', (netRoute) => {
      const mockPayload = {
        success: true,
        data: {
          patients: [
            { id: 1, name: 'Priya Sharma', age: 34, gender: 'Female', phone: '9876543210', condition: 'Psoriasis' },
          ],
          patient: { id: 1, name: 'Priya Sharma', age: 34, gender: 'Female', phone: '9876543210', condition: 'Psoriasis' },
          prescriptions: [{ id: 1, patientName: 'Priya Sharma', remedy: 'Sulphur 200C', date: '2026-08-01' }],
          metrics: { totalPatients: 120, activeCases: 45, pendingFollowups: 12 },
        },
      };
      netRoute.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPayload) });
    });

    // Inject mock auth in localStorage for protected SPA routes
    await page.goto(`${baseUrl}${routeObj.path}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Dr. MD Zaid', role: 'DOCTOR' }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    // Step A: Audit initial state (Light mode)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightResults = await page.evaluate(EVALUATE_DOM_CONTRAST);
    totalNodesEvaluated += lightResults.length;
    const lightFailures = lightResults.filter((r) => !r.passed);
    if (lightFailures.length > 0) {
      lightFailures.forEach((f) => allFailures.push({ route: routeObj.name, theme: 'light', step: 'Initial Light', ...f }));
    }

    // Step B: Click ThemeToggle (Toggle to Dark)
    const toggleBtn = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
    } else {
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    }
    await page.waitForTimeout(100);
    const darkResults = await page.evaluate(EVALUATE_DOM_CONTRAST);
    totalNodesEvaluated += darkResults.length;
    const darkFailures = darkResults.filter((r) => !r.passed);
    if (darkFailures.length > 0) {
      darkFailures.forEach((f) => allFailures.push({ route: routeObj.name, theme: 'dark', step: 'Toggle 1 (Dark)', ...f }));
    }

    // Step C: Click ThemeToggle again (Toggle back to Light - catching stale paint on flip back!)
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
    } else {
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    }
    await page.waitForTimeout(100);
    const lightFlipResults = await page.evaluate(EVALUATE_DOM_CONTRAST);
    totalNodesEvaluated += lightFlipResults.length;
    const lightFlipFailures = lightFlipResults.filter((r) => !r.passed);
    if (lightFlipFailures.length > 0) {
      lightFlipFailures.forEach((f) => allFailures.push({ route: routeObj.name, theme: 'light', step: 'Toggle 2 (Flip back to Light)', ...f }));
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`Total Text Nodes Evaluated Across Both Themes & Toggles: ${totalNodesEvaluated}`);
  console.log(`Total WCAG 2.1 Contrast Failures (<4.5:1 or <3.0:1 large): ${allFailures.length}\n`);

  if (allFailures.length > 0) {
    console.log('❌ CONTRAST FAILURES DETECTED IN REAL BROWSER:');
    allFailures.forEach((f) => {
      console.log(
        `  [${f.route} | ${f.theme.toUpperCase()} | ${f.step}] <${f.tagName}> "${f.text}" -> Text ${f.fg} on BG ${f.bg} = ${f.ratio}:1 (Required ${f.requiredRatio}:1)`
      );
    });
    process.exit(1);
  } else {
    console.log('✅ ALL TEXT CONTRAST PAIRS PASSED REAL-BROWSER WCAG 2.1 AA COMPLIANCE (0 FAILURES)!');
  }
}

runRealBrowserAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
