import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';
import terser from '@rollup/plugin-terser';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // ESM and CJS builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss({
        extract: true,
        minimize: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
      }),
    ],
  },
  // UMD build for CDN/direct browser usage
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/ui-react-components.umd.js',
      format: 'umd',
      name: 'UIReactComponents',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
    },
    external: ['react', 'react-dom'],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      postcss({
        extract: 'ui-react-components.css',
        minimize: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
      }),
      terser(), // Minify
      {
        name: 'replace-process',
        transform(code) {
          return code.replace(/process\.env\.NODE_ENV/g, JSON.stringify('production'));
        },
      },
    ],
  },
  // TypeScript definitions
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
