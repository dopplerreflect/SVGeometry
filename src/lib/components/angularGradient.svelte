<svelte:options namespace="svg" />

<script lang="ts">
	type Stops = [number, string][];
	export let id: string;
	export let line: Line;
	export let stops: Stops;
</script>

<linearGradient
	{id}
	x1={line[0].x}
	y1={line[0].y}
	x2={line[1].x}
	y2={line[1].y}
	gradientUnits="userSpaceOnUse"
>
	{#each stops as stop}
		<stop offset={`${stop[0]}%`} stop-color={stop[1]} />
	{/each}
</linearGradient>
