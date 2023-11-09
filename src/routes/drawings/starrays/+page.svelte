<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 9),
		updated_at: new Date(2023, 10, 9, 11)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { intersection, Phi, anglesArray, arrayMap, phi, radialPoint } from '$lib/geometry';

	const id = 'STARRAYS';
	const size = 2 ** 10;
	const ro = size / 8.5;
	const angles = anglesArray(10);
	const radii = arrayMap(3, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...[...radii]
			.reverse()
			.map((r, i) => angles.map((a) => ({ r, ...radialPoint(a, r * Phi ** 3 - r) })))
			.flat()
	];
	const lineArray: Line[] = [
		...radii

			.map((r) => [
				...angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 9) % 10], r, {
								center: radialPoint(angles[(i + 0) % 10], r * Phi ** 3 - r)
							}),
							radialPoint(angles[(i + 3) % 10], r, {
								center: radialPoint(angles[(i + 2) % 10], r * Phi ** 3 - r)
							})
						] as Line
				),
				...angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 9) % 10], r, {
								center: radialPoint(angles[(i + 0) % 10], r * Phi ** 3 - r)
							}),
							radialPoint(angles[(i + 5) % 10], r, {
								center: radialPoint(angles[(i + 4) % 10], r * Phi ** 3 - r)
							})
						] as Line
				)
			])
			.flat()
	];
	const inset = size / 2 + lineArray[0][0].y;
	const boundaryLines: Line[] = [
		[
			{ x: -size / 2 + inset, y: -size / 2 + inset },
			{ x: size / 2 - inset, y: -size / 2 + inset }
		],
		[
			{ x: size / 2 - inset, y: -size / 2 + inset },
			{ x: size / 2 - inset, y: size / 2 - inset }
		],
		[
			{ x: size / 2 - inset, y: size / 2 - inset },
			{ x: -size / 2 + inset, y: size / 2 - inset }
		],
		[
			{ x: -size / 2 + inset, y: size / 2 - inset },
			{ x: -size / 2 + inset, y: -size / 2 + inset }
		]
	];
	const boundaryIntersections: Point[] = [];
	lineArray.forEach((l) => {
		boundaryLines.forEach((b) => {
			let i = intersection(b, l);
			if (Math.abs(i.x) < size / 2 && Math.abs(i.y) < size / 2) {
				boundaryIntersections.push(i);
			}
		});
	});
	const extendedLines: Line[] = [];
	for (let i = 0; i < boundaryIntersections.length; i += 2) {
		extendedLines.push([boundaryIntersections[i], boundaryIntersections[i + 1]]);
	}
</script>

<DopplerSvg {id} {size}>
	<radialGradient id={`${id}-bg`} r="0.7">
		<stop offset="0%" stop-color="oklch(0.5 100% 270)" />
		<stop offset="100%" stop-color="oklch(0 50% 270)" />
	</radialGradient>
	<radialGradient id={`${id}-rg`} r="72%">
		<stop offset="0%" stop-color="oklch(1 100% 90 / 0.5)" />
		<stop offset="100%" stop-color="oklch(0 100% 90 / 0.75)" />
	</radialGradient>
	{#each angles as a, i}
		<radialGradient
			id={`${id}-rg-${i}`}
			r="72%"
			cx={`${50 + radialPoint(a, 50 * phi ** 2).x}%`}
			cy={`${50 + radialPoint(a, 50 * phi ** 2).y}%`}
		>
			<stop offset="0%" stop-color="oklch(1 100% 90 / 0.5)" />
			<stop offset="100%" stop-color="oklch(0.0 100% 90 / 0.75)" />
		</radialGradient>
	{/each}
	<filter id={`${id}-glow`}>
		<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="o" />
		<feMorphology in="SourceGraphic" operator="dilate" radius="1" />
		<feGaussianBlur stdDeviation="3" />
		<feMerge>
			<feMergeNode />
			<feMergeNode in="o" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<Background {size} fill="oklch(1 0 0)" />
	<Background {size} fill={`url(#${id}-bg)`} />
	<g filter={`url(#${id}-glow)`}>
		{#each boundaryIntersections as p}
			<circle r={2} cx={p.x} cy={p.y} style={`stroke:oklch(1 100% 210);fill:none;`} />
		{/each}
		<LineWithLegend lineArray={extendedLines} style={`stroke:oklch(1 100% 210)`} />
		<LineWithLegend lineArray={boundaryLines} style={`stroke:oklch(1 0 0)`} />
		<circle
			r={radii[2] * Math.sqrt(5)}
			style={`fill:url(#${id}-rg);stroke:oklch(0.5 100% 90);stroke-width:0;`}
		/>

		<g id="centerCircles" style={`fill:none;stroke:oklch(1 100% 90);stroke-width:1;`}>
			<circle r={radii[0] * Phi ** Math.sqrt(5)} />
			<circle r={radii[1] * Phi ** Math.sqrt(5)} />
			<circle r={radii[2] * Phi ** Math.sqrt(5)} />

			<circle r={radii[0] * Phi ** 3} />
			<circle r={radii[1] * Phi ** 3} />
			<circle r={radii[2] * Phi ** 3} />

			<circle r={radii[0] * Math.sqrt(5) * Phi} />
			<circle r={radii[0] * Math.sqrt(5)} />
			<circle r={radii[1] * Math.sqrt(5)} />
			<circle r={radii[2] * Math.sqrt(5)} />
		</g>
		{#each circles as c, i}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`fill:url(#${id}-rg-${i % 10});stroke:oklch(1 100% 90);stroke-width:1;`}
			/>
		{/each}
	</g>
</DopplerSvg>
