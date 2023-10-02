<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 1, 14),
		updated_at: new Date(2023, 9, 1, 14)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		radialPoint,
		phi,
		radialPointString,
		Phi,
		circleIntersections,
		pythag,
		pointToString
	} from '$lib/geometry';

	const id = 'THREERING';
	const size = 2 ** 10;
	const angles = anglesArray(60, 0);
	const r = size / 3.4;
	const radii = [r, r * phi];
	const circles: Circle[] = angles
		.filter((a) => a % 120 === 0)
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[1]) })))
		.flat();
	const c3 = circleIntersections(circles[0], circles[3]);
	const r2 = pythag(c3[0].x, c3[0].y);
	const c5 = circleIntersections(circles[0], circles[5])[0];
	const r5 = pythag(c5.x, c5.y);
	const lineArray: Line[] = angles.map((a) => [{ x: 0, y: 0 }, radialPoint(a, r * Phi)]);

	const path = `M0 0A${radii[1]} ${radii[1]} 0 0 1 ${radialPointString(angles[50], r * phi)}A${
		radii[1]
	} ${radii[1]} 0 0 0 ${radialPointString(angles[47], r2)}A${radii[0]} ${
		radii[0]
	} 0 0 0 ${radialPointString(angles[28], r5)}A${radii[1]} ${
		radii[1]
	} 0 0 0 0 0ZM${radialPointString(angles[53], r2)}A${radii[1]} ${
		radii[1]
	} 0 1 1 ${radialPointString(angles[12], r5)}A${radii[0]} ${radii[0]} 0 0 1 ${pointToString(
		circleIntersections(circles[0], circles[4])[0]
	)}A${radii[0]} ${radii[0]} 0 1 0 ${pointToString(
		circleIntersections(circles[0], circles[4])[1]
	)}A${radii[0]} ${radii[0]} 0 0 1 ${radialPointString(angles[53], r2)}Z`;
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#THREERING {
				& path:not(.Background),
				circle,
				line {
					stroke: oklch(1 0 0);
					stroke-width: 5;
					fill: none;
				}
				& path.c {
					stroke: white;
				}
				& path.mask {
					fill: white;
					stroke: black;
				}
			}
		</style>
		<mask id="threering-mask">
			<Background {size} fill="black" />
			{#each anglesArray(3, 0) as a, i}
				<path
					d={path}
					class="mask"
					transform={`rotate(${a})`}
					style={`stroke-width:${r * phi ** 5}`}
				/>
			{/each}
		</mask>
		<radialGradient id="threering-gradient">
			<stop offset="0%" stop-color="oklch(0.33 100% 300)" />
			<stop offset="100%" stop-color="oklch(0.165 25% 240)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#threering-gradient)" />
	<g mask="url(#threering-mask)">
		<LineWithLegend {lineArray} style={`stroke-width:${r * phi ** 8}`} />
	</g>
	<g id="rings">
		{#each anglesArray(3, 0) as a, i}
			<path
				d={path}
				class="c"
				transform={`rotate(${a})`}
				style={`fill:oklch(0.5 100% ${30 + 120 * i} / 0.5);stroke-width:${
					r * phi ** 8
				};stroke-linejoin:bevel;`}
			/>
		{/each}
	</g>
</DopplerSvg>

<style>
	@keyframes fader {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	#rings {
		animation: fader 6s ease-in-out 0s infinite alternate both;
	}
</style>
