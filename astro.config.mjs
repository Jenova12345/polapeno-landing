// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { PORTAL_START_URL, LEGAL_PAGES, PORTAL_REDIRECTS } from './src/config.mjs';

// Netlify _redirects z configu: právní dokumenty vedou na stejnou cestu v portálu.
// 302, dokud dokumenty nejsou hotové (301 by si prohlížeče zapamatovaly natrvalo).
const portal = new URL(PORTAL_START_URL).origin;
const redirects = {
	name: 'polapeno-redirects',
	hooks: {
		'astro:build:done': async ({ dir }) => {
			const radky = LEGAL_PAGES.map(({ path }) => `${path} ${portal}${path} 302`);
			// trvalá přesměrování (např. /cenik) jsou hotová, proto 301
			PORTAL_REDIRECTS.forEach(({ path, to }) => radky.push(`${path} ${to} 301`));
			await writeFile(new URL('_redirects', dir), radky.join('\n') + '\n');
		},
	},
};

// https://astro.build/config
export default defineConfig({
	build: {
		inlineStylesheets: 'always',
	},
	integrations: [redirects],
});
