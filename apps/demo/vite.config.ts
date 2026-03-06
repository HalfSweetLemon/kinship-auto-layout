import { defineConfig } from 'vite';

// GitHub Pages base path:
// - On GitHub Actions, GITHUB_REPOSITORY looks like "owner/repo"
// - We use "/repo/" as base so static assets resolve correctly
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'kinship-auto-layout';

export default defineConfig({
  base: `/${repo}/`,
});
