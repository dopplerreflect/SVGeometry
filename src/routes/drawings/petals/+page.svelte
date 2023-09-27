<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 25, 10),
		updated_at: new Date(2023, 8, 25, 18)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import AngularGradient from '$lib/components/angularGradient.svelte';
	import {
		SQRT3,
		anglesArray,
		circleIntersections,
		phylotaxicPoints,
		pythag,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'PETALS';
	const size = 2 ** 10;

	const r = size * 0.23;
	const angleCount = 24;
	const angles = anglesArray(angleCount);
	const angles2 = anglesArray(angleCount * 2);
	const circles: Circle[] = angles.map((a) => ({ r, ...radialPoint(a, r) }));
	const intersections: Point[] = [...Array(12).keys()].map(
		(i) => circleIntersections(circles[0], circles[i + 1])[0]
	);
	const radii = [r * 2, ...intersections.map((p) => pythag(p.x, p.y))];
	const gradientLines: Line[] = [...Array(12).keys()].map(
		(i) =>
			[
				radialPoint(angles2[i + 1], radii[i + 1]),
				radialPoint(angles2[i + 1], radii[i + 3] || 0)
			] as Line
	);
	const paths: string[] = angles2
		.slice(1, 10)
		.map(
			(a, i) =>
				`M${radialPointString(angles2[i], radii[i + 2])}A${r} ${r} 0 0 1 ${radialPointString(
					angles2[i + 1],
					radii[i + 1] || 0
				)}A${r} ${r} 0 0 1 ${radialPointString(
					angles2[i + 2],
					radii[i + 2] || 0
				)}A${r} ${r} 0 0 0 ${radialPointString(
					angles2[i + 1],
					radii[i + 3] || 0
				)}A${r} ${r} 0 0 0 ${radialPointString(angles2[i], radii[i + 2])}`
		);
	const ppoints = phylotaxicPoints(7200, (size / 2) * Math.sqrt(2)).filter(
		(p) => pythag(p.x, p.y) > r * 1.9
	);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#PETALS {
				& circle,
				line,
				path:not(.Background) {
					stroke: white;
					fill: none;
				}
				& path:not(.Background) {
					stroke: oklch(0 100% 300);
					stroke-width: 5;
				}
			}
		</style>
		{#each gradientLines as line, i}
			<AngularGradient
				id={`PETALS-lg${i}`}
				{line}
				stops={[
					[0, `oklch(1 100% ${30 + 20 * i})`],
					[100, `oklch(0 100% ${30 + 20 * i})`]
				]}
			/>
		{/each}
		<filter id="PETALS-filter">
			<feMorphology in="SourceAlpha" radius="8" operator="dilate" result="dilate" />
			<feFlood flood-color="oklch(0.25 100% 300)" result="floodcolor" />
			<feComposite in="floodcolor" in2="dilate" operator="in" result="dilatecolor" />
			<feGaussianBlur in="dilateColor" stdDeviation="8" result="glow" />
			<feMorphology in="SourceAlpha" radius="3" operator="dilate" result="dilate2" />
			<feFlood flood-color="oklch(0.25 100% 300)" result="darkpurple" />
			<feComposite in="darkpurple" in2="dilate2" operator="in" result="purple" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="purple" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="PETALS-glow">
			<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 100% 300)" />
	{#each ppoints as p, i}
		<circle
			filter="url(#PETALS-glow"
			r={5}
			cx={p.x}
			cy={p.y}
			style={`stroke:oklch(1 100% ${30 + 45 * (i % 89)});fill:oklch(0.75 25% ${
				30 + 45 * (i % 89)
			}  / ${1 / (i % 8)})`}
		/>
	{/each}
	<g filter="url(#PETALS-filter)">
		{#each angles as a}
			<g transform={`rotate(${a})`}>
				{#each paths as d, i}
					<path {d} style={`fill:url(#PETALS-lg${i});stroke:oklch(0.5 33% ${300 + 20 * i})`} />
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
