<script lang="ts">
	export let path: string;
	export let angles: number[];
	export let rotate: number = 0;
	export let style: string = '';
</script>

<g class="filtered">
	{#each angles as a}
		<path d={path} transform={`rotate(${a + rotate})`} {style} />
	{/each}
</g>
