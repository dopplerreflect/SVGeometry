import type { PageServerLoad } from './$types';
import { readFile, cwd } from 'node:fs/promises';

export const load = (async ({ params }) => {
	console.log({ params });
	const source: ArrayBuffer = await readFile(`./src/routes/drawings/${params.slug}/+page.svelte`);
	const decoder = new TextDecoder('utf8');
	return {
		source: decoder.decode(source).replace(/\t/g, '  ')
	};
}) satisfies PageServerLoad;
