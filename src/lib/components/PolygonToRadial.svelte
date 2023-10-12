<script lang="ts">
	export let points: string;
	export let angles: number[];
	export let rotate: number = 0;
	export let style: string = '';
	export let classname: string = '';
</script>

<g class={classname}>
	{#each angles as a}
		<polygon {points} transform={`rotate(${a + rotate})`} {style} />
	{/each}
</g>
