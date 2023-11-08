<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 8),
		updated_at: new Date(2023, 10, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		intersection,
		Phi,
		anglesArray,
		arrayMap,
		pentagram,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'PHI3STARS';
	const size = 2 ** 10 + 1.56;
	const ro = size / 9;
	const angles = anglesArray(10);
	const radii = arrayMap(3, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...radii.map((r, i) => angles.map((a) => ({ r, ...radialPoint(a, r * Phi ** 3 - r) }))).flat()
	];
	const stars = [
		...radii
			.map((r) =>
				angles.map((a, i) =>
					pentagram(r, {
						rotate: i % 2 === 0 ? 180 : 0,
						center: radialPoint(i % 2 === 0 ? a : a + 0, r * Phi ** 3 - r)
					})
				)
			)
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
	const rawIntersections: Point[] = [];
	lineArray.forEach((l, i) => {
		for (let n = i; n < lineArray.length; n++) {
			let int = intersection(l, lineArray[n]);
			if (int.x > -size / 2 && int.x < size / 2 && int.y > -size / 2 && int.y < size / 2) {
				rawIntersections.push(int);
			}
		}
	});
	const roundedIntersections = rawIntersections.map((i) => ({
		x: Math.floor(i.x),
		y: Math.floor(i.y)
	}));
	const intersectionsWithMagnitudeMap = new Map();
	roundedIntersections.forEach((intersection) => {
		const i = JSON.stringify(intersection);
		if (!intersectionsWithMagnitudeMap.get(i)) {
			intersectionsWithMagnitudeMap.set(i, 4);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 1);
		}
	});
	const dots: Circle[] = [...intersectionsWithMagnitudeMap].map((e) => {
		const c = JSON.parse(e[0]);
		return { x: c.x, y: c.y, r: e[1] };
	});
	const circleRadii = new Set([...dots.map((c) => c.r).sort((a, b) => a - b)]);
	const colors = new Map([...circleRadii].map((r, i) => [r, (180 / circleRadii.size) * i + 180]));
	console.log(colors);
</script>

<DopplerSvg {id} {size}>
	<radialGradient id={`${id}-bg`} r="0.7">
		<stop offset="0%" stop-color="oklch(0.5 100% 240)" />
		<stop offset="100%" stop-color="oklch(0 50% 240)" />
	</radialGradient>
	<radialGradient id={`${id}-rg`} r="0.5">
		<stop offset="0%" stop-color="oklch(0.5 100% 300 / 0.25)" />
		<stop offset="100%" stop-color="oklch(0 100% 300 / 0.25)" />
	</radialGradient>
	<filter id={`${id}-glow`}>
		<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="o" />
		<feMorphology in="SourceGraphic" operator="dilate" radius="1" />
		<feGaussianBlur stdDeviation="5" />
		<feMerge>
			<feMergeNode />
			<feMergeNode in="o" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
		<feColorMatrix
			values="1 0 0.5 0 0
              0.5 1 0 0 0
              0 0.5 1 0 0
              0 0 0 1 0"
		/>
	</filter>
	<Background {size} fill="oklch(1 0 0)" />
	<Background {size} fill={`url(#${id}-bg)`} />
	<g filter={`url(#${id}-glow)`}>
		{#each circles as c, i}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`fill:url(#${id}-rg);stroke:oklch(1 100% 180);stroke-width:1;`}
			/>
		{/each}
		<LineWithLegend {lineArray} style={`stroke:oklch(1 100% 300)`} />
		{#each dots as c, i}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`stroke:oklch(0.75 100% ${colors.get(c.r)});fill:oklch(1 100% ${colors.get(c.r)} );`}
			/>
			{#each angles.slice(0, 5) as a, ai}
				<path
					style={`fill:none;stroke:oklch(1 0% ${colors.get(c.r)});stroke-width:0.5`}
					d={`M${radialPointString(a + 18, c.r, {
						center: { x: c.x, y: c.y }
					})} ${radialPointString(angles[(ai + 5) % 10] + 18, c.r, {
						center: { x: c.x, y: c.y }
					})}`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
