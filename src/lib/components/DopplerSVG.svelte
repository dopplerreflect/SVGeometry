<svelte:options namespace="svg" />

<script lang="ts">
	import { viewBox as vb } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import DrLogo from './DRLogo.svelte';

	export let viewBox: string | undefined = '';
	export let id: string;

	export let size: number = 2 ** 10;
	export let style: string = '';
	export let zoom: number = 0;
	export let xPan: number = 0;
	export let yPan: number = 0;

	const defaultLogoProps = {
		size: size / 15,
		transform: `translate(${size / 2 - size / 15}, ${size / 2 - size / 15})`,
		stroke: 'white',
		strokeOpacity: 0.5
	};
	export let logoProps: {
		size?: number;
		transform?: string;
		stroke?: string;
		strokeOpacity?: number;
	} = {
		...defaultLogoProps
	};

	const mergedLogoProps = { ...defaultLogoProps, ...logoProps };

	let svg: SVGSVGElement;

	onMount(() => {
		const unmountSaveFile = useSaveFile(svg, { timestamp: true });
		const unmountZoom = useZoomableViewbox(svg, zoom, xPan, yPan);
		return () => {
			unmountSaveFile();
			unmountZoom();
		};
	});
</script>

<svg bind:this={svg} {id} viewBox={viewBox ? viewBox : vb(size)} width="100%" height="100%" {style}>
	<slot />
	<DrLogo {...mergedLogoProps} />
</svg>
