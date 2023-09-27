<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 27, 8),
		updated_at: new Date(2023, 8, 27, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, pathFromIntersectionsOfLines, phi, radialPoint } from '$lib/geometry';

	const id = 'TENWEAVE';
	const size = 2 ** 10;
	const ro = size * 0.45;
	const angleCount = 10;
	const angles = anglesArray(angleCount, 9);
	const lineArray: Line[] = [
		...angles.map(
			(_, i) => [radialPoint(angles[i], ro), radialPoint(angles[(i + 3) % angleCount], ro)] as Line
		),
		...angles.map(
			(_, i) =>
				[
					radialPoint(angles[i], ro * phi ** 0.44),
					radialPoint(angles[(i + 3) % angleCount], ro * phi ** 0.44)
				] as Line
		)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[8, 7, 0, 8, 10, 17, 8].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[18, 0, 11, 10, 18].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENWEAVE {
				& path:not(.Background) {
					fill: none;
				}
				& path.weave {
					stroke-width: 5;
					stroke: oklch(1 50% 60);
				}
				& path.weave-dark {
					fill: oklch(0.125 100% 270 / 0.5);
				}
			}
		</style>
		<filter id="TENWEAVE-space">
			<!-- lifted from Bence Szabo on codepen.io https://codepen.io/finnhvman/ -->
			<feTurbulence type="fractalNoise" seed="2" baseFrequency=".002" numOctaves="4" />
			<feDisplacementMap scale="80" />
			<feColorMatrix
				values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.5 -.2"
			/>
			<feColorMatrix
				values="2 0 0 0 -.6
                0.2 0 0.5 .5 -.5
                0 0 .8 0 0.5
                0 0 0 1 0"
				result="n"
			/>
			<feTurbulence baseFrequency=".2" result="s" />
			<feTurbulence baseFrequency=".1" />
			<feBlend in="s" />
			<feColorMatrix
				values="0 0 0 9 -6
                0 0 0 9 -6
                0 0 0 9 -6
                0 0 0 0 1"
			/>
			<feBlend in="n" />
		</filter>
		<filter id="TENWEAVE-glow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilate" />
			<feFlood flood-color="oklch(0.5 100% 300)" />
			<feComposite in2="dilate" operator="in" />
			<feGaussianBlur stdDeviation="3" result="glow" />
			<feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilate2" />
			<feOffset dy="4" result="offset" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="offset" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} filter="url(#TENWEAVE-space)" />
	<g>
		{#each angles as a}
			<g transform={`rotate(${a - 9})`}>
				{#each paths as d}
					<path {d} class="weave-dark" />
				{/each}
			</g>
		{/each}
	</g>

	<g filter="url(#TENWEAVE-glow)">
		{#each angles as a}
			<g transform={`rotate(${a - 9})`}>
				{#each paths as d}
					<path {d} class="weave" />
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
