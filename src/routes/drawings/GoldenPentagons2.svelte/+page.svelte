<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: []
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		pathFromIntersectionsOfLines,
		pentagram,
		phi,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'GoldenPentagons2';
	const size = 2 ** 10;
	const ro = size / 4.1;
	const radii = [ro, ro * phi, ro * phi ** 2, ro * phi ** 3, ro * phi ** 4];
	const angles = anglesArray(10);
	const paths: string[] = [
		...angles
			// .slice(0, 2)
			.map((a, i) =>
				radii.map((r) => polygonPath(5, r, { center: radialPoint(a, radii[0]), rotate: 36 * i }))
			)
	].flat();
	const lines: Line[] = [
		...[270, 306, 342]
			.map((oa, oi) =>
				radii.map((r) =>
					[270, 342, 54, 126, 198].map(
						(ia, ii) =>
							[
								radialPoint(ia, r, { center: radialPoint(oa, radii[0]), rotate: 36 * oi }),
								radialPoint([270, 342, 54, 126, 198][(ii + 1) % 5], r, {
									center: radialPoint(oa, radii[0]),
									rotate: 36 * oi
								})
							] as Line
					)
				)
			)
			.flat()
	].flat();
	const paths2: string[] = [
		pathFromIntersectionsOfLines(['M', ...[0, 29, 25, 54].map((i) => lines[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 34, 0, 29, 5].map((i) => lines[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[34, 5, 6, 39, 35, 58, 59, 30, 34].map((i) => lines[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[34, 33, 10, 39, 6, 5, 34].map((i) => lines[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[35, 36, 37, 38, 39, 35].map((i) => lines[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[40, 41, 42, 43, 44, 40].map((i) => lines[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[45, 46, 47, 48, 49, 45].map((i) => lines[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.25 0.18 300)' }}>
	<defs>
		<filter id="GoldenPentagons2Filter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="2" result="blur" />
			<feOffset in="blur" dx="0" dy="5" result="offset" />
			<feMerge>
				<feMergeNode in="offset" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<style>
			line {
				stroke: white;
			}
			text {
				font-size: 1.5em;
			}
			.g0 {
				fill: oklch(0 0.37 300);
				stroke: oklch(90% 25% 300);
				stroke-width: 1;
				filter: url(#GoldenPentagons2Filter);
			}
			.g1 {
				fill: oklch(0.1 0.37 300);
				stroke: oklch(90% 25% 300);
				stroke-width: 1;
				filter: url(#GoldenPentagons2Filter);
			}
			.g2 {
				fill: oklch(0.3 0.37 300);
				stroke: oklch(90% 25% 300);
				stroke-width: 1;
				filter: url(#GoldenPentagons2Filter);
			}
			.g3 {
				fill: oklch(0.4 0.37 300);
				stroke: oklch(90% 25% 300);
				stroke-width: 1;
				filter: url(#GoldenPentagons2Filter);
			}
			.g4 {
				fill: oklch(1 0.37 60);
				stroke: oklch(20% 100% 90);
				filter: url(#GoldenPentagons2Filter);
			}
			.g4.pentagram {
				fill: none;
				stroke: oklch(1 0.37 60);
				stroke-width: 3;
				stroke-linejoin: bevel;
				filter: url(#GoldenPentagons2Filter);
			}
			.g5 {
				fill: oklch(1 0.37 75);
				stroke: oklch(20% 100% 90);
				filter: url(#GoldenPentagons2Filter);
			}
			.g6 {
				fill: oklch(1 0.37 90);
				stroke: oklch(20% 100% 90);
				filter: url(#GoldenPentagons2Filter);
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.66 0.045 300)" />
	<g class="g0">
		{#each angles as a, i}
			<path d={paths2[0]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<g class="g1">
		{#each angles as a, i}
			<path d={paths2[1]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<g class="g2">
		{#each angles as a, i}
			<path d={paths2[2]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<g class="g3">
		{#each angles as a, i}
			<path d={paths2[3]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<path class="g3" d={polygonPath(10, radii[1] + radii[1] * phi ** 4, { rotate: 18 })} />
	<path class="g0" d={polygonPath(10, radii[1], { rotate: 18 })} />
	<path class="g4 pentagram" d={pentagram(radii[1], { rotate: 198 })} />
	<path class="g4 pentagram" d={pentagram(radii[1], { rotate: 18 })} />
	<g class="g4">
		{#each angles as a, i}
			<path d={paths2[4]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<g class="g5">
		{#each angles as a, i}
			<path d={paths2[5]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
	<g class="g6">
		{#each angles as a, i}
			<path d={paths2[6]} transform={`rotate(${a + 18})`} />
		{/each}
	</g>
</DopplerSvg>
