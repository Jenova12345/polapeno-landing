// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { SITE_URL, PORTAL_START_URL, LEGAL_PAGES, PORTAL_REDIRECTS, CAMPAIGN_REDIRECTS } from './src/config.mjs';
import { kanonickaUrl } from './src/lib/kanonicka.mjs';

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
			// krátké odkazy pro kampaně: 302, cíl se může měnit
			CAMPAIGN_REDIRECTS.forEach(({ path, to }) => radky.push(`${path} ${to} 302`));
			await writeFile(new URL('_redirects', dir), radky.join('\n') + '\n');
		},
	},
};

// sitemap.xml ze všech vygenerovaných stránek (nová stránka se do ní dostane
// sama). Bez 404 a bez cest, které jen přesměrovávají (_redirects). lastmod
// je datum buildu.
const presmerovane = new Set([...LEGAL_PAGES, ...PORTAL_REDIRECTS, ...CAMPAIGN_REDIRECTS].map(({ path }) => kanonickaUrl(path)));
const sitemap = {
	name: 'polapeno-sitemap',
	hooks: {
		'astro:build:done': async ({ dir, pages }) => {
			const lastmod = new Date().toISOString().slice(0, 10);
			const urls = [...new Set(pages.map(({ pathname }) => kanonickaUrl('/' + pathname)))]
				.filter((url) => !/\/404\/$/.test(url) && !presmerovane.has(url))
				.sort();
			const xml = [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				...urls.map((url) => `\t<url>\n\t\t<loc>${url.replace(/&/g, '&amp;')}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t</url>`),
				'</urlset>',
			].join('\n');
			await writeFile(new URL('sitemap.xml', dir), xml + '\n');
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	build: {
		inlineStylesheets: 'always',
	},
	integrations: [redirects, sitemap],
});
