/** @type {import('./$types').LayoutLoad} */
export function load({ route }) {
	return { title: route.id.replace(/\/drawings\//, '') };
}
