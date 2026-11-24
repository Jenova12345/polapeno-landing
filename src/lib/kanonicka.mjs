import { SITE_URL } from '../config.mjs';

// Kanonická URL stránky: SITE_URL + cesta, vždy bez query parametrů (UTM,
// fbclid) a hashe. Stránky jsou adresáře (/reference/), proto končí lomítkem.
// Používá ji Base.astro (canonical, og:url) i sitemap.xml v astro.config.mjs,
// aby se obě vždy shodovaly.
export function kanonickaUrl(cesta = '/') {
	let p = new URL(cesta, SITE_URL).pathname;
	if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
	return new URL(p, SITE_URL).href;
}
