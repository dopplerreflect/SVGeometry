<script lang="ts">
	export let points: string;
	export let angles: number[];
	export let rotate: number = 0;
	export let style: string = '';
</script>

<g class="filtered">
	{#each angles as a}
		<polygon {points} transform={`rotate(${a + rotate})`} {style} />
	{/each}
</g>
