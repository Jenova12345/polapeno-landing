export const SITE_NAME = 'Polapeno';
export const SITE_TAGLINE = 'telefonní asistent pro autoservisy';
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
// Meta description (120–155 znaků; jen tvrzení, která jsou na stránce). NÁVRH, čeká na schválení.
export const META_DESCRIPTION = `Telefonní asistent pro autoservisy. Nezvednuté hovory vezme za vás a zapíše poptávku. Číslo si necháte, tarif od ${PRICE_START} Kč měsíčně bez závazku.`;
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

// Video reference v heru (na mobilu blok pod herem). false = video se nezobrazí.
export const VIDEO_REFERENCE = true;
export const VIDEO_REFERENCE_CAPTION = 'Autoslužby Ander, Rychvald';
export const VIDEO_REFERENCE_SOUND = 'Pustit se zvukem';
// Ručně psaná poznámka u videa (desktop od 1200 px; pod tím je text na začátku
// popisku). Písmo public/fonts/caveat-poznamka.woff2 je ořezané jen na znaky
// tohoto textu: při změně textu je potřeba písmo znovu ořezat (pyftsubset).
export const VIDEO_REFERENCE_NOTE = 'Reference od zákazníka';

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

// Krátké odkazy pro kampaně (302, cíl se může měnit), přidají se do _redirects.
export const CAMPAIGN_REDIRECTS = [
	// SMS z Meta lead formulářů
	{ path: '/fb', to: '/?utm_source=facebook&utm_medium=leadform&utm_campaign=lead-listopad&utm_content=sms' },
];
