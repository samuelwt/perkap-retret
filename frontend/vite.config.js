import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves your site from a sub-path unless your repo is named
// exactly "yourusername.github.io" (a "user site", served from the root).
// If instead you create a repo like "trip-inventory" and enable Pages on it
// (a "project site"), it's served from "yourusername.github.io/trip-inventory/",
// so every asset URL needs that prefix or nothing will load correctly.
//
// Set this to match your actual repo name, or '/' if using a user site.
const BASE_PATH = '/perkap-retret/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
});
