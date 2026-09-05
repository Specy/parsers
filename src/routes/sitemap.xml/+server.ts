import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Project surfaces hold the reader's own grammars; they are not content to index. */
const EXCLUDED = new Set([
	'/projects',
	'/projects/new',
	// its +layout.ts sets prerender = false, so no page is ever built for it
	'/docs/dotlr/typescript-parser'
]);

/** Discovered rather than hand-listed, so a new docs page is in the sitemap as soon as
 *  it exists. Parameterised routes only ever render local projects, so they are skipped. */
function routes() {
	const modules = import.meta.glob('/src/routes/**/+page.svelte');
	return Object.keys(modules)
		.map((file) => file.replace('/src/routes', '').replace('/+page.svelte', '') || '/')
		.filter((route) => !route.includes('['))
		.filter((route) => !EXCLUDED.has(route))
		.sort();
}

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET = async () => {
	const buildDate = new Date().toISOString().slice(0, 10);
	const entries = routes().map(
		(route) => `	<url>
		<loc>${escapeXml(SITE_URL + route)}</loc>
		<lastmod>${buildDate}</lastmod>
	</url>`
	);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
