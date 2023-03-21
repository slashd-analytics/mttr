import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'



export default {
  input: 'src/index.js',
  output: {
    file: 'dist/mttr.min.js',
    format: 'umd',
    name: 'Mttr',
    sourcemap: false,
    globals: {
    }
  },
  watch: {
    exclude: 'dist/*',
    include: 'src/**'
  },
  plugins:[
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser(),
    commonjs(),
    resolve(),
    postcss({
      modules: {
        globalModulePaths: [
          /global/
        ]
      },
      autoModules: false,
      plugins: [
        autoprefixer({ grid: true }),
        cssnano({ preset: 'default' })
      ]
    })
  ]
}
