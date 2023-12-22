<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 21),
		updated_at: new Date(2023, 11, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		circleIntersections as ci,
		circleLineIntersections as cli,
		phi,
		pointToString,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'ICOSADODECA';
	const size = 2 ** 10;
	const angles = anglesArray(10, -162);
	const r = (size * phi) / 10;
	const radii = arrayMap(4, (n) => r * Phi ** n);
	const c: Circle[] = [
		...angles.map((a, i) => [
			...radii.slice(0, 2).map((r, ri) => ({ r, ...radialPoint(a, radii[2]) })),
			...radii.slice(0, 3).map((r, ri) => ({ r, ...radialPoint(a, radii[3]) })),
			{ r: radii[3] - (radii[2] - radii[1] * 0.9098300562505258), ...radialPoint(a, radii[3]) }
		])
	].flat();

	const l: Line[] = [
		...angles.slice(0).map((a) => [
			[{ x: 0, y: 0 }, radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))] as Line,
			[
				radialPoint(a + 72, radii[0], { center: radialPoint(a, radii[2]) }),
				radialPoint(a + 72, radii[0], {
					center: radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))
				})
			] as Line,
			[
				radialPoint(a - 72, radii[0], { center: radialPoint(a, radii[2]) }),
				radialPoint(a - 72, radii[0], {
					center: radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))
				})
			] as Line
		])
	].flat();

	const polygonPoints: string[] = [
		[
			ci(c[12], c[15])[1],
			ci(c[12], c[15])[0],
			ci(c[13], c[16])[0],
			ci(c[7], c[16])[1],
			ci(c[13], c[16])[1]
		],
		[
			ci(c[24], c[27])[1],
			ci(c[24], c[27])[0],
			ci(c[25], c[28])[0],
			ci(c[19], c[28])[1],
			ci(c[25], c[28])[1]
		],
		[
			ci(c[36], c[39])[1],
			ci(c[36], c[39])[0],
			ci(c[37], c[40])[0],
			ci(c[31], c[40])[1],
			ci(c[37], c[40])[1]
		],
		[
			ci(c[48], c[51])[1],
			ci(c[48], c[51])[0],
			ci(c[49], c[52])[0],
			ci(c[43], c[52])[1],
			ci(c[49], c[52])[1]
		],
		[
			ci(c[0], c[3])[1],
			ci(c[0], c[3])[0],
			ci(c[1], c[4])[0],
			ci(c[55], c[4])[1],
			ci(c[1], c[4])[1]
		],
		[ci(c[18], c[21])[0], ci(c[18], c[21])[1], ci(c[13], c[25])[0]],
		[ci(c[13], c[25])[0], ci(c[19], c[28])[1], ci(c[7], c[16])[1]],

		[ci(c[30], c[33])[0], ci(c[30], c[33])[1], ci(c[25], c[37])[0]],
		[ci(c[25], c[37])[0], ci(c[31], c[40])[1], ci(c[19], c[28])[1]],

		[ci(c[42], c[45])[0], ci(c[42], c[45])[1], ci(c[37], c[49])[0]],
		[ci(c[37], c[49])[0], ci(c[43], c[52])[1], ci(c[31], c[40])[1]],

		[ci(c[54], c[57])[0], ci(c[54], c[57])[1], ci(c[1], c[49])[1]],
		[ci(c[49], c[1])[0], ci(c[55], c[4])[1], ci(c[43], c[52])[1]],

		[ci(c[6], c[9])[0], ci(c[6], c[9])[1], ci(c[1], c[13])[0]],
		[ci(c[1], c[13])[0], ci(c[7], c[16])[1], ci(c[7], c[0])[0]],
		[
			ci(c[7], c[19])[1],
			ci(c[19], c[31])[1],
			ci(c[31], c[43])[1],
			ci(c[43], c[55])[1],
			ci(c[55], c[7])[1]
		]
	].map((o) => o.map((e) => pointToString(e)).join(' '));

	const blobs = [
		polygonPoints,
		polygonPoints.slice(0, 11).concat(polygonPoints.slice(12)),
		polygonPoints.slice(0, 13).concat(polygonPoints.slice(14)),
		polygonPoints.slice(0, 5).concat(polygonPoints.slice(6)),
		polygonPoints
			.slice(0, 7)
			.concat(polygonPoints.slice(8))
			.slice(0, 12)
			.concat(polygonPoints.slice(14))
	];
	// console.log(polygonPoints);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="ICOSADODECA-filter">
			<feColorMatrix
				values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.75 0"
			/>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<!-- {#each c as c, i}
		<text
			x={radialPoint(270, c.r, { center: { x: c.x, y: c.y } }).x}
			y={radialPoint(270, c.r, { center: { x: c.x, y: c.y } }).y}
			style="fill:white;">{i}</text
		>
	{/each} -->
	<LineWithLegend lineArray={l} style="stroke:oklch(0.99 100% 150);" />
	{#each c as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.99 100% 150);fill:none;`} />
	{/each}

	<g
		filter="url(#ICOSADODECA-filter)"
		style="stroke:oklch(0.99 100% 150);fill:oklch(0.25 100% 300 );"
	>
		{#each angles.filter((a, i) => i % 2 == 1) as a, i}
			<g transform={`translate(${radialPointString(a, radii[3])})`}>
				{#each polygonPoints as points}
					<polygon {points} />
				{/each}
			</g>
		{/each}

		{#each angles.filter((a, i) => i % 2 == 0) as a, i}
			{#each blobs[i] as points}
				<g transform={`translate(${radialPointString(a, radii[3])})`}>
					<polygon {points} />
				</g>
			{/each}
		{/each}
		{#each angles.filter((a, i) => i % 2 === 0) as a}
			<polygon
				points={[ci(c[18], c[21])[0], ci(c[18], c[21])[1], ci(c[16], c[19])[0]]
					.map((e) => pointToString(e))
					.join(' ')}
				transform={`rotate(${a + 18})`}
			/>
		{/each}
		{#each polygonPoints as points}
			<polygon {points} />
		{/each}
	</g>
</DopplerSvg>
