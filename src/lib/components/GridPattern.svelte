<script>
	import { arrayMap } from '$lib/geometry';

	export let id = 'gridPattern',
		size = 100,
		stroke = 'oklch(1 0 0)',
		strokeWidth = 1;

	const ticks = arrayMap(9, (n) => (size / 10) * (n + 1));
</script>

<pattern {id} width={size} height={size} patternUnits="userSpaceOnUse">
	<path
		d={`M0 0h${size}v${size}h${-size}Z`}
		style={`stroke-width:${strokeWidth};stroke:${stroke}`}
	/>
	<g style={`stroke-width:${strokeWidth / 2}`}>
		{#each ticks as t}
			<line x1={t} y1={0} x2={t} y2={size} style={`stroke:${stroke}`} />
			<line x1={0} y1={t} x2={size} y2={t} style={`stroke:${stroke}`} />
		{/each}
	</g>
</pattern>
