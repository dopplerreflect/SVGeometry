<script lang="ts">
	import { midpoint, quarterPoint } from '$lib/geometry';

	export let lineArray: Line[];
	export let name: string = '';
	export let fill: string = 'yellow';
	export let showLegend: Boolean = false;
	export let style = '';
	export let useQuarterPoint = false;
</script>

{#each lineArray as l, i}
	<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class={name} {style} />
	{#if showLegend}
		<text
			{fill}
			x={useQuarterPoint ? quarterPoint(l).x : midpoint(l).x}
			y={useQuarterPoint ? quarterPoint(l).y : midpoint(l).y}>{`${name}${i}`}</text
		>
	{/if}
{/each}

<style>
	text {
		stroke: none;
		text-anchor: middle;
		alignment-baseline: middle;
	}
</style>
