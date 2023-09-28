<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 28, 9),
		updated_at: new Date(2023, 8, 28, 9)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		chordLength,
		pathFromIntersectionsOfLines,
		phi,
		pythag2,
		radialPoint
	} from '$lib/geometry';

	const id = 'TENWEAVE2';
	const size = 2 ** 10;
	const ro = size * 0.45;
	const angles = anglesArray(10, 0);
	const lineArray: Line[] = [
		...angles.map(
			(_, i) => [radialPoint(angles[i], ro), radialPoint(angles[(i + 3) % 10], ro)] as Line
		),
		...angles.map(
			(_, i) =>
				[radialPoint(angles[i], ro * 0.9), radialPoint(angles[(i + 3) % 10], ro * 0.9)] as Line
		),
		...angles.map((a) => [{ x: 0, y: 0 }, radialPoint(a, ro)] as Line)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[7, 6, 29, 16, 7].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[21, 1, 9, 11, 21].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[19, 1, 12, 11, 19].map((i) => lineArray[i]), 'Z'])
	];
	const paths2: string[] = [
		pathFromIntersectionsOfLines(['M', ...[10, 8, 9, 17, 10].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENWEAVE2 {
				& path:not(.Background) {
					fill: black;
					stroke: red;
					stroke-width: 2;
					stroke-linejoin: bevel;
				}
				& path.weave {
					stroke-width: 5;
					stroke: oklch(1 50% 60);
				}
				& path.weave-dark {
					fill: oklch(0 0 0);
				}
				& line {
					stroke: oklch(0.5 0 0);
				}
			}
		</style>
		<filter id="TENWEAVE2-bamboo-filter" filterUnits="">
			<feFlood flood-color="oklch(0.75 20% 80)" result="c" />
			<feTurbulence type="fractalNoise" baseFrequency="0.01 1" />
			<feColorMatrix
				type="matrix"
				values="0.5 0 0 0 0
                0.2 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0"
			/>
			<feDisplacementMap scale="25" xChannelSelector="G" yChannelSelector="R" />
			<feBlend in2="c" />
			<feComposite in2="SourceGraphic" operator="in" result="wood" />
		</filter>

		<filter id="TENWEAVE2-walnut-filter" filterUnits="">
			<feFlood flood-color="oklch(0.4 50% 75)" result="c" />
			<feTurbulence type="fractalNoise" baseFrequency="0.001 1" />
			<feColorMatrix
				type="matrix"
				values="0.5 0 0 0 0
                0 0.05 0 0 0 
                0 0 0.05 0 0
                0 0 0 1 0"
			/>
			<feDisplacementMap scale="25" xChannelSelector="G" yChannelSelector="R" />
			<feBlend in2="c" />
			<feComposite in2="SourceGraphic" operator="in" result="wood" />
			<feMorphology operator="erode" radius="4" result="shrink" />
			<feFlood flood-color="oklch(0.25 33% 30)" />
			<feComposite in2="SourceGraphic" operator="in" result="black" />
			<feMerge>
				<feMergeNode in="black" />
				<feMergeNode in="shrink" />
			</feMerge>
		</filter>

		{#each angles as a, i}
			<filter id={`TENWEAVE-angle-wood-${a}`} filterUnits="">
				<feFlood flood-color={`oklch(${0.3 / (i % 2)} ${50 + i}% 75)`} result="c" />
				<feTurbulence seed={i * 3} type="fractalNoise" baseFrequency={`0.5 0.001`} />
				<feColorMatrix
					type="matrix"
					values="0.5 0 0 0 0
          0 0.05 0 0 0 
          0 0 0.05 0 0
          0 0 0 1 0"
				/>
				<feBlend in2="c" />
				<feComposite in2="SourceGraphic" operator="in" result="wood" />
				<feMorphology operator="erode" radius="2" result="shrink" />
				<feFlood flood-color="oklch(0.25 33% 30)" />
				<feComposite in2="SourceGraphic" operator="in" result="black" />
				<feMerge>
					<feMergeNode in="black" />
					<feMergeNode in="shrink" />
				</feMerge>
			</filter>
		{/each}

		<filter id="TENWEAVE2-dimensional">
			<feColorMatrix
				type="matrix"
				values="0.15 0 0 0 0
                0 0.15 0 0 0
                0 0 0.15 0 0
                0 0 0 1 0"
			/>
			<feMorphology operator="dilate" radius="3" />
			<feOffset dy="4" result="edge" />
			<feGaussianBlur in="edge" stdDeviation="3" />
			<feOffset dy="10" result="shadow" />
			<feMerge>
				<feMergeNode in="shadow" />
				<feMergeNode in="edge" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="TENWEAVE2-bg">
			<feFlood flood-color="oklch(0.5 0 0)" result="color" />
			<feTurbulence type="fractalNoise" baseFrequency="0.5" />
			<feColorMatrix
				type="matrix"
				values="0.5 0.0 0.0 0.0 0
                0.0 0.5 0.0 0.0 0
                0.0 0.0 0.7 0.0 0
                0.0 0.0 0.0 1 0"
			/>
			<feMerge>
				<feMergeNode in="color" />
				<feMergeNode />
			</feMerge>
		</filter>
	</defs>
	<Background {size} filter="url(#TENWEAVE2-bg)" />
	<g filter="url(#TENWEAVE2-dimensional)">
		{#each angles as a}
			<g transform={`rotate(${a})`}>
				<path
					d={pathFromIntersectionsOfLines([
						'M',
						...[10, 8, 9, 17, 10].map((i) => lineArray[i]),
						'Z'
					])}
					filter="url(#TENWEAVE2-walnut-filter)"
				/>
				<path
					d={pathFromIntersectionsOfLines(['M', ...[16, 28, 27, 16].map((i) => lineArray[i]), 'Z'])}
					filter={`url(#TENWEAVE-angle-wood-${a})`}
				/>
			</g>
		{/each}
		{#each angles as a}
			<g transform={`rotate(${a})`}>
				{#each paths as d}
					<path {d} filter="url(#TENWEAVE2-bamboo-filter)" />
					<path
						d={pathFromIntersectionsOfLines(['M', ...[6, 17, 15, 6].map((i) => lineArray[i]), 'Z'])}
						style="fill:oklch(0.25 33% 30);stroke:none;"
					/>
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
