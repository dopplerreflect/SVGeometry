<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 21),
		updated_at: new Date(2023, 8, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import AngularGradient from '$lib/components/angularGradient.svelte';
	import {
		anglesArray,
		arrayMap,
		pathFromIntersectionsOfLines,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'EEEE';
	const size = 2 ** 10;
	const ro = size * 0.45;
	const radii = arrayMap(8, (n) => ro * phi ** n);
	const angles = anglesArray(30);
	const ten = arrayMap(10, (n) => n);

	const lineArray: Line[] = [
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 0) % angles.length], i % 2 === 0 ? radii[0] : radii[2]),
					radialPoint(angles[(i * 3 + 3) % angles.length], i % 2 === 0 ? radii[2] : radii[0])
				] as Line
		),
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 1) % angles.length], i % 2 === 0 ? radii[1] : radii[3]),
					radialPoint(angles[(i * 3 + 4) % angles.length], i % 2 === 0 ? radii[3] : radii[1])
				] as Line
		),
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 2) % angles.length], i % 2 === 0 ? radii[2] : radii[4]),
					radialPoint(angles[(i * 3 + 5) % angles.length], i % 2 === 0 ? radii[4] : radii[2])
				] as Line
		),
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 3) % angles.length], i % 2 === 0 ? radii[3] : radii[5]),
					radialPoint(angles[(i * 3 + 6) % angles.length], i % 2 === 0 ? radii[5] : radii[3])
				] as Line
		),
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 29) % angles.length], i % 2 === 0 ? radii[1] : radii[3]),
					radialPoint(angles[(i * 3 + 26) % angles.length], i % 2 === 0 ? radii[3] : radii[1])
				] as Line
		),
		...ten.map(
			(i) =>
				[
					radialPoint(angles[(i * 3 + 28) % angles.length], i % 2 === 0 ? radii[2] : radii[4]),
					radialPoint(angles[(i * 3 + 25) % angles.length], i % 2 === 0 ? radii[4] : radii[2])
				] as Line
		)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines([
			'M',
			...[38, 28, 29, 51, 52, 39, 38].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[28, 50, 18, 19, 51, 52, 20, 42, 41, 29, 28].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[51, 19, 41, 29, 51].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[18, 19, 51, 50, 18].map((i) => lineArray[i]),
			'Z',
			'M',
			...[42, 41, 29, 20, 42].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[40, 51, 19, 10, 29, 41, 40].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[9, 0, 19, 41, 9].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[20, 52, 10, 42, 20].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[20, 42, 52, 10, 20].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[10, 42, 1, 0, 10].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size} zoom={0} yPan={0} logoProps={{ stroke: 'oklch(0.5 50% 90)' }}>
	<defs>
		<style>
			svg#EEEE circle,
			svg#EEEE path:not(.Background) {
				fill: none;
			}
			svg#EEEE #EEEE-guide {
				/* display: none; */
				stroke: oklch(0.5 50% 90);
			}
			svg#EEEE #EEEE-lines {
				/* display: none; */
				stroke: oklch(1 50% 60);
				filter: url(#EEEE-dsFilter);
			}
			svg#EEEE path.tile {
				fill: oklch(1 0 0 / 0.2);
				filter: url(#EEEE-tileFilter);
			}
			svg#EEEE path.tile.t0 {
				fill: url(#ag0);
			}
			svg#EEEE path.tile.t1 {
				fill: url(#ag1);
			}
			svg#EEEE path.tile.t2 {
				fill: url(#ag2);
			}
			svg#EEEE path.tile.t3 {
				fill: url(#ag3);
			}
			svg#EEEE path.tile.t4 {
				fill: url(#ag4);
			}
			svg#EEEE path.tile.t5 {
				fill: url(#ag5);
			}
			svg#EEEE path.tile.t6,
			svg#EEEE path.tile.t7 {
				fill: 'white';
			}
			svg#EEEE path.tile.t8 {
				fill: url(#ag8);
			}
		</style>
		<filter id="EEEE-tileFilter">
			<feMorphology in="SourceGraphic" operator="erode" radius="3" result="shrink" />
			<feColorMatrix
				in="shrink"
				type="matrix"
				values="2.0 0.0 0.0 0 0
      0.0 2.0 0.0 0 0
      0.0 0.0 2.0 0 0
      0 0 0 1 0"
				result="lighten"
			/>
			<feOffset in="lighten" dy="-3" result="lighten-up" />
			<feColorMatrix
				in="shrink"
				type="matrix"
				values="0.25 0.0 0.0 0 0
        0.0 0.25 0.0 0 0
        0.0 0.0 0.25 0 0
        0 0 0 1 0"
				result="darken"
			/>
			<feOffset in="darken" dy="3" result="darken-down" />
			<feMerge>
				<feMergeNode in="lighten-up" />
				<feMergeNode in="darken-down" />
				<feMergeNode in="shrink" />
			</feMerge>
		</filter>
		<filter id="EEEE-dsFilter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilate" />
			<feFlood flood-color="oklch(0.5 100% 90)" result="color" />
			<feComposite in="color" in2="dilate" operator="in" result="colorstroke" />
			<feGaussianBlur in="dilate" stdDeviation="1" result="blur" />
			<feOffset in="blur" dy="-2" result="offsetblur" />
			<feMerge>
				<feMergeNode in="offsetblur" />
				<feMergeNode in="colorstroke" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
			<feOffset dx={0} dy={-2} />
		</filter>
		<AngularGradient
			id="ag0"
			line={[radialPoint(angles[0], radii[5]), radialPoint(angles[0], radii[3] - radii[6])]}
			stops={[
				[0, 'oklch(0.5 100% 120)'],
				[100, 'oklch(1 100% 120)']
			]}
		/>
		<AngularGradient
			id="ag1"
			line={[radialPoint(angles[0], radii[4]), radialPoint(angles[0], radii[3])]}
			stops={[
				[0, 'oklch(1 100% 90)'],
				[100, 'oklch(0.5 100% 90)']
			]}
		/>
		<AngularGradient
			id="ag2"
			line={[radialPoint(angles[0], radii[3] - radii[6]), radialPoint(angles[0], radii[2])]}
			stops={[
				[0, 'oklch(1 100% 210'],
				[100, 'oklch(0 100% 210)']
			]}
		/>
		<AngularGradient
			id="ag3"
			line={[radialPoint(angles[0], radii[3]), radialPoint(angles[0], radii[2] - radii[7])]}
			stops={[
				[0, 'oklch(1 100% 300'],
				[100, 'oklch(0 100% 300)']
			]}
		/>
		<AngularGradient
			id="ag4"
			line={[radialPoint(angles[0], radii[3]), radialPoint(angles[0], radii[1])]}
			stops={[
				[0, 'oklch(1 100% 90'],
				[100, 'oklch(0 100% 90)']
			]}
		/>
		<AngularGradient
			id="ag5"
			line={[radialPoint(angles[0], radii[2]), radialPoint(angles[0], radii[0])]}
			stops={[
				[0, 'oklch(1 100% 200'],
				[100, 'oklch(0 100% 200)']
			]}
		/>
		<AngularGradient
			id="ag8"
			line={[radialPoint(angles[3], radii[3]), radialPoint(angles[3], radii[1])]}
			stops={[
				[0, 'oklch(1 100% 120'],
				[100, 'oklch(0 100% 120)']
			]}
		/>
	</defs>
	<Background {size} fill="oklch(0.2 10% 90)" />
	<g id="EEEE-rays">
		{#each anglesArray(5 * radii.length * 6) as a}
			<path
				d={`M${radialPointString(a, radii[radii.length - 1])} ${radialPointString(
					a,
					(size / 2) * Math.sqrt(2)
				)}`}
				style="stroke:oklch(0.33 100% 300)"
			/>
		{/each}
	</g>
	<g id="EEEE-tiles">
		{#each anglesArray(5, 0) as a}
			<g transform={`rotate(${a})`}>
				{#each paths as d, i}
					<path class={`tile t${i}`} {d} />
				{/each}
			</g>
		{/each}
	</g>

	<g id="EEEE-guide">
		{#each radii as r}
			<circle {r} />
		{/each}
		{#each angles as a, i}
			<path d={`M${radialPointString(a, radii[radii.length - 1])} ${radialPointString(a, ro)}`} />
		{/each}
	</g>
	<g id="EEEE-lines" filter="" transform="translate(0, 0)">
		<LineWithLegend name="" {lineArray} />
	</g>
</DopplerSvg>
