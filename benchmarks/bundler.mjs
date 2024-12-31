import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import {join} from 'node:path';
import {mkdir, writeFile, stat} from 'node:fs/promises'
import {build} from 'vite'
import {gzipSize} from 'gzip-size';
import * as brotliSize from 'brotli-size';
import {randomUUID} from 'node:crypto';
import {optimizeCssModules} from '../dist/index.mjs';

if (isMainThread) {
  throw new Error('This module must be run as a worker.');
}

const benchmark = join(process.cwd(), 'benchmarks');
const output = join(benchmark, '.output', randomUUID());

// Clean and re-create output directory
await mkdir(output).catch(() => 0);

const sizeFor = async (string) => ({
  gzip: await gzipSize(string),
  brotli: brotliSize.sync(string),
});

const {input, optimize = false} = workerData;
const root = join(output, `${input}.html`);
const module = join(output, `${input}.ts`);
const css = join(benchmark, 'fixtures', input);

await writeFile(root, `<script type="module" src="${module}"></script>`)
await writeFile(module, `import styles from '${css}'; console.log(Object.entries(styles));`)

const start = process.hrtime.bigint();
const result = await build({
  plugins: optimize ? [optimizeCssModules()] : [],
  build: {
    outDir: output,
    rollupOptions: {
      input: {
        app: root
      }
    }
  }
});

const builtTime = process.hrtime.bigint() - start;
const minifiedCssFile = result.output.find(v => v.fileName.endsWith('.css')).source;
const sizes = await sizeFor(minifiedCssFile);

parentPort.postMessage({
  input,
  builtTime: Number(builtTime),
  optimized: optimize,
  sizes: {
    ...sizes,
    original: (await stat(css)).size
  }
});


