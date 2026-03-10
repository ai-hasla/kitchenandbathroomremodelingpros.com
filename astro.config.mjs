import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kitchenandbathroomremodelingpros.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/privacy/') && !page.includes('/terms/'),
      serialize(item) {
        item.lastmod = new Date().toISOString();

        if (item.url === 'https://kitchenandbathroomremodelingpros.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/services/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/cost-guides/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/areas-served/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
