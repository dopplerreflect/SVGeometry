import { get } from 'svelte/store';
import { drawingsStore } from '$lib/stores/drawingStore';
/** @type {import('./$types').LayoutLoad} */
export function load({ route }) {
	const drawings = get(drawingsStore);
	return { title: route.id.replace(/\/drawings\//, ''), drawings };
}
