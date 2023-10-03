<script lang="ts">
	export let size: number = 0;
	export let width: number = size;
	export let height: number = width;
	export let fill: string = 'black';
	export let transform: string | null = null;
	export let filter: string | null = null;
	export let mask = '';
</script>

<path
	class="Background"
	d={`M${-width / 2} ${-height / 2}H${width / 2}V${height / 2}H${-width / 2}Z`}
	{fill}
	{transform}
	{filter}
	{mask}
/>
