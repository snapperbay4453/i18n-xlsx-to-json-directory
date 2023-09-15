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
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'es',
    },
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      resolve({ browser:true, extensions }),
      commonjs(),
      eslint(),
      typescript(),
      terser(),
    ],
  },
  {
    input: './src/index.ts',
    output: [{
      file: './dist/index.d.ts',
      format: 'es',
    }],
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      dts(),
    ],
  },
]
