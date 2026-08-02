/**
 * Post-build step for the GitHub Pages landing bundle.
 *
 * Vite names the output after its entry (index.landing.html), but Pages serves
 * index.html as the directory default — so rename it. Also drops a .nojekyll
 * file, without which Pages' Jekyll pass ignores Vite's /assets/_* filenames.
 *
 * Run cross-platform via Node rather than shell built-ins: this builds on
 * Ubuntu in CI but is developed on Windows.
 */
import { rename, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const clientDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(clientDir, 'dist-landing');

const from = path.join(outDir, 'index.landing.html');
const to = path.join(outDir, 'index.html');

try {
  await access(from);
  await rename(from, to);
  console.log('finalize-landing: index.landing.html -> index.html');
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
  // Already named index.html (or the entry changed) — verify the file Pages needs exists.
  await access(to).catch(() => {
    throw new Error(`finalize-landing: no index.html in ${outDir} — did the build run?`);
  });
  console.log('finalize-landing: index.html already present, nothing to rename');
}

await writeFile(path.join(outDir, '.nojekyll'), '');
console.log('finalize-landing: wrote .nojekyll');
