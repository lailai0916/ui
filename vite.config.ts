import { defineConfig } from 'vite';

export default defineConfig({
  css: { modules: { generateScopedName: 'lk-[name]__[local]__[hash:base64:5]' } },
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], cssFileName: 'styles' },
    sourcemap: true,
    minify: false,
    cssMinify: true,
    rollupOptions: {
      external: (id) => /^(react|react-dom|@iconify\/react|@base-ui\/react|clsx)(\/|$)/.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        banner: '"use client";',
      },
    },
  },
});
