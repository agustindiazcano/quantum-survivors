import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Dev server opens the browser by itself; the build inlines JS and CSS
// into a single dist/index.html.
export default defineConfig({
  plugins: [viteSingleFile()],
  server: { open: true },
});
