<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 3, 20),
		updated_at: new Date(2023, 10, 3, 20)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, intersection, radialPoint } from '$lib/geometry';

	const id = 'QUASICRYSTAL';
	const size = 2 ** 10;
	const angles = anglesArray(10);
	const r = (size / 2) * 0.95;
	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 2) % 10], r)] as Line),
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 4) % 10], r)] as Line)
	];
	const r1i = intersection(lineArray[0], lineArray[1]);
	const r1 = Math.hypot(r1i.x, r1i.y);
	const r2i = intersection(lineArray[10], lineArray[11]);
	const r2 = Math.hypot(r2i.x, r2i.y);
	angles.forEach((a, i) => {
		lineArray.push([radialPoint(a + 18, r1), radialPoint(angles[(i + 3) % 10] + 18, r1)]);
		lineArray.push([radialPoint(a + 18, r1), { x: 0, y: 0 }]);
		lineArray.push([radialPoint(a + 18, r2), radialPoint(angles[(i + 3) % 10] + 18, r2)]);
	});
	const rawIntersections: Point[] = [];
	lineArray.forEach((l, i) => {
		for (let n = i + 1; n < lineArray.length; n++) {
			let int = intersection(lineArray[i], lineArray[n]);
			if (int.x > -size / 2 && int.x < size / 2) {
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
			intersectionsWithMagnitudeMap.set(i, 1);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 1);
		}
	});
	const circles: Circle[] = [...intersectionsWithMagnitudeMap].map((e) => {
		const c = JSON.parse(e[0]);
		return { x: c.x, y: c.y, r: e[1] };
	});
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="QUASICRYSTAL-glow">
			<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="n" />
			<feMorphology in="SourceGraphic" operator="dilate" radius="2" />
			<feGaussianBlur stdDeviation="10" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="n" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<LineWithLegend {lineArray} style={`stroke:oklch(0.1 100% 300)`} />
	<g filter="url(#QUASICRYSTAL-glow)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`fill:white;`} />
		{/each}
	</g>
</DopplerSvg>
