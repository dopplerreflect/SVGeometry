<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(),
		updated_at: new Date()
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
		radialPoint
	} from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const angles = anglesArray(10, -162);
	const r = (size * phi) / 10;
	const radii = arrayMap(4, (n) => r * Phi ** n);
	const c: Circle[] = [
		...angles
			// .slice(0, 5)
			.map((a, i) => [
				...radii.slice(0, 2).map((r, ri) => ({ r, ...radialPoint(a, radii[2]) })),
				...radii.slice(0, 3).map((r, ri) => ({ r, ...radialPoint(a, radii[3]) })),
				{ r: radii[3] - (radii[2] - radii[1] * 0.9098300562505258), ...radialPoint(a, radii[3]) }
			])
	].flat();

	const l: Line[] = [
		...angles.slice(0, 5).map((a) => [
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
			cli(c[17], l[8])[0],
			cli(c[17], l[7])[0],
			ci(c[16], c[23])[0],
			cli(c[15], l[6])[1],
			ci(c[16], c[11])[1]
		],
		[cli(c[17], l[7])[0], ci(c[17], c[22])[0], ci(c[16], c[23])[0]],
		[ci(c[16], c[23])[0], ci(c[15], c[21])[0], cli(c[15], l[6])[1]]
	].map((o) => o.map((e) => pointToString(e)).join(' '));
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each c as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.5 0 0);fill:none;`} />
	{/each}
	{#each c as c, i}
		<text
			x={radialPoint(270, c.r, { center: { x: c.x, y: c.y } }).x}
			y={radialPoint(270, c.r, { center: { x: c.x, y: c.y } }).y}
			style="fill:white;">{i}</text
		>
	{/each}
	<LineWithLegend lineArray={l} showLegend style="stroke:oklch(0.5 50% 90);" />
	{#each polygonPoints as points}
		<polygon {points} style="stroke:oklch(0.99 100% 150);fill:none;" />
	{/each}
</DopplerSvg>
