<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 23, 19),
		updated_at: new Date(2023, 8, 23, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		pathFromIntersectionsOfLines,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'STARMESH2';
	const size = 2 ** 10;
	const ro = (size / 2) * 0.95;
	const angles = anglesArray(10);
	const radii = [ro, ro * phi, ro * phi ** 2];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[0]), radialPoint(angles[(i + 2) % 10], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[1]), radialPoint(angles[(i + 2) % 10], radii[1])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[0]), radialPoint(angles[(i + 4) % 10], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], { center: radialPoint(a, radii[1]) }),
					radialPoint(angles[(i + 2) % 10], radii[2], { center: radialPoint(a, radii[1]) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], { center: radialPoint(a, radii[1]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[1])
					})
				] as Line
		)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[27, 28, 29, 27].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[27, 40, 48, 29, 27].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[40, 48, 10, 18, 40].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[18, 10, 20, 26, 18].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[28, 27, 49, 48, 28].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[48, 49, 29, 26, 48].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[48, 10, 27, 40, 18, 29, 48].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[20, 48, 41, 27, 20].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[48, 41, 9, 27, 41, 48, 0, 20, 48].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[41, 31, 30, 48, 41].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[31, 30, 0, 9, 31].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.5 20% 60)' }}>
	<defs>
		<style>
			svg#STARMESH2 {
				& circle,
				path:not(.Background),
				line {
					stroke: white;
					fill: none;
				}
				& #guide circle,
				#guide path,
				#guide line {
					stroke: oklch(0.5 20% 60);
				}
				& #paths path {
					/* display: none; */
					stroke: oklch(0 100% 180);
					stroke-width: 0;
					stroke-linejoin: round;
					fill: oklch(10% 100% 300 / 1);
					filter: url(#starmesh2-shrink);
				}
			}
		</style>
		<filter id="starmesh2-shrink">
			<feMorphology in="SourceGraphic" operator="erode" radius={(size / 1024) * 4} result="erode" />
			<feFlood flood-color="oklch(100% 33% 60)" result="color" />
			<feComposite in="color" in2="erode" operator="in" result="composite" />
			<feMorphology in="composite" operator="dilate" radius={(size / 1024) * 1} result="dilate" />
			<feMerge>
				<feMergeNode in="dilate" />
				<feMergeNode in="erode" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(25% 10% 60)" />

	<g id="guide">
		{#each angles as a}
			<circle r={radii[2]} cx={radialPoint(a, radii[1]).x} cy={radialPoint(a, radii[1]).y} />
			<path d={`M0 0 ${radialPointString(a, radii[0])}`} />
		{/each}
		<circle r={radii[0]} />
		<circle r={radii[1]} />
		<circle r={radii[2]} />
		<LineWithLegend name="" {lineArray} />
	</g>

	<g id="paths">
		{#each angles as a}
			<g transform={`rotate(${a - 18})`}>
				{#each paths as d, i}
					<path {d} style={`fill:oklch(45% 33% ${30 + 6 * i} )`} />
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
