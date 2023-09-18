import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import eslint from '@rollup/plugin-eslint';
import terser from '@rollup/plugin-terser';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensions = ['.js', '.ts'];

export default [
  {
    input: './src/browser.ts',
    output: {
      file: './dist/browser.js',
      format: 'es',
    },
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      resolve({ browser: true, extensions }),
      commonjs(),
      eslint(),
      typescript(),
      terser(),
    ],
  },
  {
    input: './src/node.ts',
    output: {
      file: './dist/node.js',
      format: 'cjs',
    },
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      resolve({ extensions }),
      commonjs(),
      eslint(),
      typescript(),
      terser(),
    ],
  },
  {
    input: './src/browser.ts',
    output: [{
      file: './dist/browser.d.ts',
      format: 'es',
    }],
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      dts(),
    ],
  },
  {
    input: './src/node.ts',
    output: [{
      file: './dist/node.d.ts',
      format: 'cjs',
    }],
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      dts(),
    ],
  },
]
