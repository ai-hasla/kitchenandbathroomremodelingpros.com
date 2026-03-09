import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://kitchenandbathroomremodelingpros.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
});
