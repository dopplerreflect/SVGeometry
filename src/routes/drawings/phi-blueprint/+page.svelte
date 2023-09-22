<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 22, 12),
		updated_at: new Date(2023, 8, 22, 13)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import { Phi, SQRT3, anglesArray, phi, radialPoint } from '$lib/geometry';

	const id = 'phi-blueprint';
	const size = 2 ** 10;

	const r = size * 0.0912277694299528;
	const r2 = r * SQRT3 * phi;
	const angles = anglesArray(6);

	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...angles.map((a) => ({ r, ...radialPoint(a, r) })),
		...angles.map((a) => ({ r: r * 2, ...radialPoint(a, r) }))
	];
	const phiCircles: Circle[] = [r2, r2 * Phi, r2 * Phi ** 2].map((r) => ({ r, x: 0, y: 0 }));
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#phi-blueprint {
				--stroke: oklch(1 25% 270);
				& circle,
				line,
				path:not(.Background) {
					stroke: var(--stroke);
					fill: none;
				}
				& text {
					font-family: monospace;
					font-weight: bold;
					fill: var(--stroke);
				}
				& circle.phi {
					stroke-width: 2;
				}
			}
		</style>
		<GridPattern size={100} stroke="oklch(0.6 50% 270)" />
	</defs>
	<Background {size} fill="oklch(0.3 40% 270)" />
	<g transform={`scale(${Phi})`}>
		<Background {size} fill="url(#gridPattern)" />
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each phiCircles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} class="phi" />
			<line x1={c.r} x2={c.r} y2={-r2 * 3} />
			<text x={c.r} y={-r2 * 3} text-anchor="start">{`${(c.r / 100).toFixed(3)}`}</text>
		{/each}
	</g>
</DopplerSvg>
