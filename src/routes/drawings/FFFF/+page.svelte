<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 21, 17),
		updated_at: new Date(2023, 8, 22, 9)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import AngularGradient from '$lib/components/angularGradient.svelte';
	import {
		anglesArray,
		arrayMap,
		intersection,
		midpoint,
		pathFromIntersectionsOfLines,
		phi,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'FFFF';
	const size = 2 ** 10;
	const ro = size / 2;
	const radii = arrayMap(3, (n) => ro * phi ** (n + 1));
	const angles = anglesArray(6);

	const lineArray: Line[] = [
		...angles
			.slice(0, 2)
			.map((oa, oi) =>
				radii.map((r) => [
					...angles.map(
						(ia, ii) =>
							[
								radialPoint(ia, r / 2, { center: radialPoint(oa, r), rotate: 30 }),
								radialPoint(angles[(ii + 1) % 6], r / 2, {
									center: radialPoint(oa, r),
									rotate: 30
								})
							] as Line
					),
					...angles.map(
						(ia, ii) =>
							[
								radialPoint(ia, r * phi ** 2, { center: radialPoint(oa + 30, r) }),
								radialPoint(angles[(ii + 1) % 6], r * phi ** 2, {
									center: radialPoint(oa + 30, r)
								})
							] as Line
					)
				])
			)
			.flat()
	].flat();

	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[33, 25, 21, 64, 33].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[21, 25, 24, 13, 30, 52, 65, 64, 21].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[30, 13, 9, 52, 30].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[9, 13, 12, 1, 18, 40, 53, 52, 9].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[18, 1, 0, 11, 6, 7, 41, 40, 18].map((i) => lineArray[i]),
			'Z'
		]),

		pathFromIntersectionsOfLines([
			'M',
			...[63, 64, 33, 32, 51, 71, 70, 62, 63].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[51, 32, 31, 20, 65, 60, 61, 59, 66, 71, 51].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[60, 65, 20, 39, 59, 61, 60].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[39, 20, 19, 8, 53, 48, 49, 47, 54, 59, 39].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[48, 53, 8, 7, 41, 36, 37, 42, 47, 49, 48].map((i) => lineArray[i]),
			'Z'
		]),

		pathFromIntersectionsOfLines([
			'M',
			...[33, 34, 14, 13, 21, 25, 33].map((i) => lineArray[i]),
			'Z',
			'M',
			...[33, 32, 51, 52, 21, 64, 33].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[14, 34, 35, 22, 21, 13, 14].map((i) => lineArray[i]),
			'Z',
			'M',
			...[51, 52, 21, 20, 31, 32, 51].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[21, 22, 35, 24, 13, 21].map((i) => lineArray[i]),
			'Z',
			'M',
			...[21, 52, 65, 31, 20, 21].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[21, 13, 24, 25, 21].map((i) => lineArray[i]),
			'Z',
			'M',
			...[21, 64, 65, 52, 21].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[24, 35, 30, 13, 24].map((i) => lineArray[i]),
			'Z',
			'M',
			...[65, 52, 30, 31, 65].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[35, 22, 24, 35].map((i) => lineArray[i]),
			'Z',
			'M',
			...[20, 31, 65, 20].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[24, 22, 2, 1, 9, 13, 30, 35, 24].map((i) => lineArray[i]),
			'Z',
			'M',
			...[65, 31, 30, 52, 9, 40, 39, 20, 65].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[2, 22, 23, 10, 9, 1, 2].map((i) => lineArray[i]),
			'Z',
			'M',
			...[39, 40, 9, 8, 19, 20, 39].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[9, 10, 23, 12, 1, 9].map((i) => lineArray[i]),
			'Z',
			'M',
			...[9, 40, 53, 19, 8, 9].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[9, 1, 12, 13, 9].map((i) => lineArray[i]),
			'Z',
			'M',
			...[9, 52, 53, 40, 9].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[12, 23, 18, 1, 12].map((i) => lineArray[i]),
			'Z',
			'M',
			...[53, 40, 18, 19, 53].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[23, 10, 12, 23].map((i) => lineArray[i]),
			'Z',
			'M',
			...[19, 53, 8, 19].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[12, 10, 11, 0, 1, 18, 23, 12].map((i) => lineArray[i]),
			'Z',
			'M',
			...[53, 19, 18, 40, 41, 7, 8, 53].map((i) => lineArray[i]),
			'Z'
		])
	];

	const gradientLines: Line[] = [
		[midpoint(lineArray[33]), midpoint(lineArray[21])],
		[midpoint(lineArray[21]), midpoint(lineArray[30])],
		[midpoint(lineArray[30]), midpoint(lineArray[9])],
		[midpoint(lineArray[9]), midpoint(lineArray[18])],
		[midpoint(lineArray[18]), midpoint(lineArray[6])],

		[midpoint(lineArray[63]), midpoint(lineArray[51])],
		[midpoint(lineArray[51]), midpoint(lineArray[60])],
		[midpoint(lineArray[60]), midpoint(lineArray[39])],
		[midpoint(lineArray[39]), midpoint(lineArray[48])],
		[midpoint(lineArray[48]), midpoint(lineArray[36])],

		[midpoint(lineArray[33]), midpoint(lineArray[21])],
		[intersection(lineArray[14], lineArray[34]), intersection(lineArray[22], lineArray[35])],
		// [intersection(lineArray[22], lineArray[35]), intersection(lineArray[24], lineArray[35])],
		[
			intersection(lineArray[22], lineArray[35]),
			midpoint([
				intersection(lineArray[24], lineArray[35]),
				intersection(lineArray[24], lineArray[22])
			])
		],
		[intersection(lineArray[22], lineArray[35]), intersection(lineArray[24], lineArray[35])],
		[intersection(lineArray[13], lineArray[24]), intersection(lineArray[30], lineArray[13])],
		[intersection(lineArray[35], lineArray[22]), intersection(lineArray[22], lineArray[24])],
		[intersection(lineArray[35], lineArray[24]), intersection(lineArray[9], lineArray[13])],
		[intersection(lineArray[22], lineArray[2]), intersection(lineArray[9], lineArray[23])],
		[intersection(lineArray[23], lineArray[9]), intersection(lineArray[23], lineArray[12])],
		[intersection(lineArray[13], lineArray[9]), intersection(lineArray[13], lineArray[12])],
		[intersection(lineArray[12], lineArray[1]), intersection(lineArray[1], lineArray[18])],
		[intersection(lineArray[10], lineArray[23]), midpoint(lineArray[12])],
		[intersection(lineArray[12], lineArray[23]), intersection(lineArray[11], lineArray[0])]
	];

	const gradientStops: [number, string][][] = paths.map((_, i) => [
		[0, `oklch(0.99 15% ${45 + (390 / paths.length) * i})`],
		[100, `oklch(0.33 100% ${45 + (390 / paths.length) * i})`]
	]);
</script>

<DopplerSvg {id} {size} zoom={0} yPan={0} logoProps={{ stroke: 'oklch(0.25 100% 200)' }}>
	<defs>
		<style>
			svg#FFFF circle,
			svg#FFFF path:not(.Background) {
				fill: none;
			}
			svg#FFFF #FFFF-hexes {
				/* display: none; */
				stroke: oklch(0.99 50% 300);
				filter: url(#FFFF-ds);
			}
			svg#FFFF path.tile {
				filter: url(#DDDD-shrink);
			}
		</style>
		<filter id="DDDD-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="1" result="bordererode" />
			<feFlood flood-color="oklch(0.99 75% 300)" result="floodcolor" />
			<feComposite in="floodcolor" in2="bordererode" operator="in" result="border" />
			<feMorphology in="SourceGraphic" operator="erode" radius="3" result="shrink" />

			<feMerge>
				<feMergeNode in="border" />
				<feMergeNode in="shrink" />
			</feMerge>
		</filter>
		<filter id="FFFF-ds">
			<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilate" />
			<feFlood flood-color="oklch(0.33 100% 300)" result="color" />
			<feComposite in="color" in2="dilate" operator="in" result="border" />
			<feGaussianBlur in="dilate" stdDeviation="3" result="blur" />
			<feOffset in="blur" dy="3" result="offsetblur" />
			<feMerge>
				<feMergeNode in="border" />
				<feMergeNode in="offsetblur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern
			id="FFFF-hp"
			size={ro * phi ** 9}
			patternTransform="rotate(30)"
			stroke="oklch(0.25 100% 200)"
		/>
		{#each gradientLines as p, i}
			<AngularGradient id={`FFFF-ag${i}`} line={gradientLines[i]} stops={gradientStops[i]} />
		{/each}
	</defs>
	<Background {size} fill="oklch(0.01 100% 300)" />
	<Background {size} fill="url(#FFFF-hp)" />
	<g id="FFFF-tiles" transform="translate(0, -1)">
		{#each angles as a}
			<g transform={`rotate(${a - 30})`}>
				{#each paths as d, i}
					<path {d} class="tile" style={`fill:url(#FFFF-ag${i})`} />
				{/each}
			</g>
		{/each}
	</g>
	<g id="FFFF-hexes">
		{#each radii as r, i}
			{#each angles as a}
				<path
					d={polygonPath(6, r / 2, {
						center: radialPoint(a, r),
						rotate: 30
					})}
				/>
				<path
					d={polygonPath(6, r * phi ** 2, {
						center: radialPoint(a + 30, r)
					})}
				/>
			{/each}
		{/each}
	</g>
	<!-- <LineWithLegend name="" {lineArray} showLegend /> -->
</DopplerSvg>
