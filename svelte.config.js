import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code === 'css-unused-selector') {
      return;
    }
    handler(warning);
  },
};
export default config;