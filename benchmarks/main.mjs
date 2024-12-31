import {join} from 'node:path';
import {readdir, mkdir, rm} from 'node:fs/promises';
import {Worker} from 'node:worker_threads';
import prettyBytes from 'pretty-bytes';

const benchmark = join(process.cwd(), 'benchmarks');
const workerModule = join(benchmark, 'bundler.mjs');
const output = join(benchmark, '.output');

// Clean and re-create output directory
await rm(output, {recursive: true}).catch(() => 0);
await mkdir(output).catch(() => 0);

const inputs = await readdir(join(benchmark, 'fixtures'));
const workers = await Promise.all(
  [true, false].flatMap((optimize) =>
    inputs.map(input =>
      new Promise((resolve, reject) => {
        const worker = new Worker(workerModule, {workerData: {input, optimize}});
        worker.on('message', resolve);
        worker.on('error', reject);
      })
    )
  )
)

// Cleanup
await rm(output, {recursive: true}).catch(() => 0);

// Print results
const markdown = [
  '| Input | Build Time | Gzip Size | Brotli Size |',
  '| --- | --- | --- | --- |'
];

for (const result of workers) {
  if (!result.optimized) continue;
  const unoptimized = workers.find(v => v.input === result.input && !v.optimized);

  const buildTimeDiff = Math.round((result.builtTime - unoptimized.builtTime) / 1_000_000);
  const buildTimePercent = ((result.builtTime - unoptimized.builtTime) / unoptimized.builtTime * 100).toFixed(2);
  const gzipDiff = result.sizes.gzip - unoptimized.sizes.gzip;
  const gzipPercent = ((result.sizes.gzip - unoptimized.sizes.gzip) / unoptimized.sizes.gzip * 100).toFixed(2);
  const brotliDiff = result.sizes.brotli - unoptimized.sizes.brotli;
  const brotliPercent = ((result.sizes.brotli - unoptimized.sizes.brotli) / unoptimized.sizes.brotli * 100).toFixed(2);

  markdown.push([
    '| ',
    `[${result.input}](benchmarks/fixtures/${result.input})`,
    ` | ${Math.round(result.builtTime / 1_000_000)}ms (_**${buildTimePercent}%**_ / _**${buildTimeDiff}ms**_)`,
    ` | ${prettyBytes(result.sizes.gzip)} (_**${gzipPercent}%**_ / _**${prettyBytes(gzipDiff)}**_)`,
    ` | ${prettyBytes(result.sizes.gzip)} (_**${brotliPercent}%**_ / _**${prettyBytes(brotliDiff)}**_)`,
    ' |'
  ].join(''));
}

console.log('\n\n');
console.log(markdown.join('\n'));
console.log('\n\n');
