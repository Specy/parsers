export const SITE_URL = 'https://tokeko.specy.app';

const AUTHOR = {
	'@type': 'Person',
	name: 'Specy',
	url: 'https://specy.app',
	sameAs: ['https://github.com/Specy']
} as const;

export function toAbsoluteUrl(pathname: string) {
	return `${SITE_URL}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}

/** `</script>` inside a JSON string would close the surrounding tag; escaping the three
 *  characters that can do that keeps it valid JSON but inert as markup. */
export function serializeJsonLd(value: unknown) {
	return JSON.stringify(value)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
}

export function softwareApplicationLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Tokeko',
		description:
			'Write a grammar and watch an LR(1) or LALR parser build its tables and parse your input step by step, in the browser.',
		url: SITE_URL,
		applicationCategory: 'EducationalApplication',
		operatingSystem: 'Any (web browser)',
		offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
		featureList: [
			'LR(1) and LALR parser generation from your own grammar',
			'FIRST and FOLLOW set visualisation',
			'Automaton, ACTION and GOTO table inspection',
			'Step by step parse trace of an input string'
		],
		author: AUTHOR,
		sameAs: ['https://github.com/Specy/tokeko', 'https://github.com/Specy/dotlr']
	};
}
