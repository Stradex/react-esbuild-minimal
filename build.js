const { build } = require('esbuild')

build({
  entryPoints: ['./src/index.jsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  outfile: './src/Bundle.js',
})