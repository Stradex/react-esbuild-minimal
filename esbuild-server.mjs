import * as esbuild from 'esbuild'
import http from 'node:http'

// Start esbuild's server on a random local port
let ctx = await esbuild.context({
    entryPoints: ['./src/index.jsx'],
    bundle: true,
    minify: true,
    sourcemap: true,
    loader: { '.js': 'jsx' },
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    outfile: './src/Bundle.js',
});

// The return value tells us where esbuild's local server is
let { host, port } = await ctx.serve({ servedir: 'src/' });

// Then start a proxy server on port 3000
const server = http.createServer((req, res) => {
  const options = {
    hostname: host,
    port: port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  // Forward each incoming request to esbuild
  const proxyReq = http.request(options, proxyRes => {
    // If esbuild returns "not found", send a custom 404 page
    if (proxyRes.statusCode === 404) {
      const redirectReq = http.request({ ...options, path: "/" }, (proxyRes) => {
        // Forward the response from esbuild to the client
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });
      redirectReq.end();
    } else {

      // Otherwise, forward the response from esbuild to the client
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    }
  })

  // Forward the body of the request to esbuild
  req.pipe(proxyReq, { end: true })
});

server.listen(3000, 'localhost', () => {
  console.log('Server is up and running on http://localhost:3000/');
});