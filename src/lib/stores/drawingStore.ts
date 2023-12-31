import { readable } from 'svelte/store';

const modules = import.meta.glob('../../routes/drawings/**/+page.svelte', { eager: true });

const drawings = Object.entries(modules).map(([path, module]: any) => ({
	name: path.replace(/.*drawings\//, '').replace(/\/\+page\.svelte/, ''),
	module: module
}));

export const drawingsStore = readable(drawings);
