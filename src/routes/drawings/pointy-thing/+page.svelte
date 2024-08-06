<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 6),
		updated_at: new Date(2023, 10, 6)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';

	const id = 'POINTY-THING';
	// const size = 2 ** 10;
	const width = 4900;
	const height = 6800;

	const angles = anglesArray(20, 0);
	const r = width / 4;
	const path = [
		'M',
		radialPointString(angles[0], r),
		...angles.map((a, i) => `Q0 0 ${radialPointString(angles[(i + 1) % angles.length], r)}`),
		'Z'
	].join(' ');
	const points: Point[] = angles.map((a, i) => radialPoint(a, r));
</script>

<DopplerSvg {id} viewBox={viewBox(width, height)}>
	<defs>
		<symbol
			id="sticker"
			x={-width / 2}
			y={-width / 2}
			{width}
			height={width}
			viewBox={viewBox(width)}
			refX="center"
			refY="center"
		>
			<path d={path} />
		</symbol>
		<radialGradient id="POINTY-THING-rg">
			<stop offset="0%" stop-color="oklch(0.99 100% 180 / 0.25)" />
			<stop offset="50%" stop-color="oklch(0.33 100% 300 / 0.25)" />
			<stop offset="75%" stop-color="oklch(0.99 100% 90 / 0.5)" />
		</radialGradient>
		<filter id="POINTY-THING-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="POINTY-THING-shadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="3" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="POINTY-THING-bg" width={width * 2} height={height * 2}>
			<feTurbulence type="turbulence" baseFrequency="0.004" numOctaves="8" seed="5" />
			<feDisplacementMap scale="1024" width={width * 2} xChannelSelector="B" yChannelSelector="R" />
			<feColorMatrix
				values="0 0 0 0 0
                0 1 0 0 1
                0 0 1 0 1
                0 0 0 1 -0.25"
			/>
		</filter>
	</defs>
	<Background size={height} fill="oklch(0.01 75% 300)" />
	<Background
		{width}
		{height}
		filter="url(#POINTY-THING-bg)"
		transform={`translate(${-width / 4} ${-width / 2})`}
	/>
	<g filter="url(#POINTY-THING-glow)" transform={`rotate(${90 + angles[1]})`}>
		{#each points as p}
			<use xlink:href="#sticker" x={p.x} y={p.y} style={`fill:url(#POINTY-THING-rg)`} />
		{/each}
		{#each points as p}
			<use
				xlink:href="#sticker"
				x={p.x}
				y={p.y}
				style="stroke:oklch(0.99 100% 75 / 0.5);stroke-width:2;fill:none;"
			/>
		{/each}
		<use
			xlink:href="#sticker"
			x={0}
			y={0}
			style="stroke:oklch(0.99 100% 75 / 1);stroke-width:2;fill:url(#POINTY-THING-rg);fill-opacity:1;"
			transform={`rotate(${angles[1] / 2})`}
			filter="url(#POINTY-THING-shadow)"
		/>
	</g>
</DopplerSvg>

<!-- xmlns:xlink="http://www.w3.org/1999/xlink" -->
