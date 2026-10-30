export const SITE_NAME = 'Polapeno';
export const SITE_TAGLINE = 'Telefonní asistent pro autoservisy';
export const SITE_URL = 'https://polapeno.cz';
export const PORTAL_START_URL = 'https://app.polapeno.cz/start';
export const PORTAL_LOGIN_URL = 'https://app.polapeno.cz/login';
export const CONTACT_EMAIL = 'info@polapeno.cz';
// záznam souhlasu s cookies (portál ho povoluje jen z https://polapeno.cz)
export const CONSENT_API_URL = 'https://app.polapeno.cz/api/consent';
// Meta Pixel, načte se jen s marketingovým souhlasem; prázdné = vypnuto
export const META_PIXEL_ID = '2840626756307794';
export const DEMO_READY = false;
export const DEMO_NUMBER = '+420 000 000 000';
export const PRICE_START = 590;
export const PRICE_PROFI = 1490;
export const CTA_PRIMARY = 'Zavolejte si asistenta';
export const CTA_SECONDARY = 'Vyzkoušet zdarma';
export const CALLS_START = 60;
export const CALLS_PROFI = 200;
export const PRICE_EXTRA_START = 9;
export const PRICE_EXTRA_PROFI = 7;
export const PRICE_QUARTERLY_START = 1590;
export const PRICE_QUARTERLY_PROFI = 3990;
export const PRICE_YEARLY_START = 5900;
export const PRICE_YEARLY_PROFI = 14900;
export const TRIAL_MINUTES = 5;

// Právní dokumenty: na landing page jen cesta, Netlify přesměruje
// na stejnou cestu v portálu (_redirects se generuje při buildu).
export const LEGAL_PAGES = [
	{ path: '/soukromi', label: 'Zásady ochrany osobních údajů' },
	{ path: '/podminky', label: 'Obchodní podmínky' },
	{ path: '/zpracovatelska-smlouva', label: 'Zpracovatelská smlouva' },
	{ path: '/cookies', label: 'Cookies' },
	{ path: '/zpracovatele', label: 'Zpracovatelé' },
];

// Trvalá přesměrování do portálu (301), přidají se do _redirects při buildu.
export const PORTAL_REDIRECTS = [
	{ path: '/cenik', to: 'https://app.polapeno.cz/cenik' },
];
