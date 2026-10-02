import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite plugin to handle /album/* static optimized images
function albumPlugin(): Plugin {
  return {
    name: 'album-static-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const decodedUrl = decodeURIComponent(req.url || '');
        if (decodedUrl.startsWith('/album/')) {
          const relPath = decodedUrl.replace(/^\/album\//, '');
          const publicFilePath = path.resolve(__dirname, 'public', 'album', relPath);
          const rootFilePath = path.resolve(__dirname, relPath);
          
          const filePath = fs.existsSync(publicFilePath) ? publicFilePath : (fs.existsSync(rootFilePath) ? rootFilePath : null);

          if (filePath && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === '.png') mimeType = 'image/png';
            if (ext === '.webp') mimeType = 'image/webp';
            
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            const stream = fs.createReadStream(filePath);
            return stream.pipe(res);
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), albumPlugin()],
  base: './',
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
