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
	import {
		anglesArray,
		phi,
		phylotaxicPoints,
		pythag,
		pythag2,
		radialPoint,
		radialPointString,
		starPath
	} from '$lib/geometry';

	const id = 'INFINITISTAR';
	const size = 2 ** 10;
	const r = (size / 4) * 1.2;
	const ix = (r - r * phi) / 2;
	const cx = r - ix;
	const iy = pythag2(r, cx);
	const circles: Circle[] = [
		{ r, x: -cx, y: 0 },
		{ r: r * phi, x: -cx, y: 0 },
		{ r, x: cx, y: 0 },
		{ r: r * phi, x: cx, y: 0 }
	];
	const angles = anglesArray(10, 0);
	const paths: string[] = [
		`M${radialPointString(angles[4], r, {
			center: { x: cx, y: 0 }
		})}A${r} ${r} 0 0 1 ${radialPointString(angles[5], r, {
			center: { x: cx, y: 0 }
		})}L${radialPointString(angles[5], r * phi, { center: { x: cx, y: 0 } })}A${r * phi} ${
			r * phi
		} 0 0 0 ${radialPointString(angles[4], r * phi, { center: { x: cx, y: 0 } })}`,
		...angles.slice(0, 10).map(
			(a, i) =>
				`M${radialPointString(-a, r, {
					center: { x: -cx, y: 0 }
				})}A${r} ${r} 0 0 0 ${radialPointString(-angles[(i + 1) % 10], r, {
					center: { x: -cx, y: 0 }
				})}L${radialPointString(-angles[(i + 1) % 10], r * phi, { center: { x: -cx, y: 0 } })}A${
					r * phi
				} ${r * phi} 0 0 1 ${radialPointString(-a, r * phi, { center: { x: -cx, y: 0 } })}Z`
		),
		...angles.slice(0, 9).map(
			(a, i) =>
				`M${radialPointString(a - 180, r, {
					center: { x: cx, y: 0 }
				})}A${r} ${r} 0 0 1 ${radialPointString(angles[(i + 6) % 10], r, {
					center: { x: cx, y: 0 }
				})}L${radialPointString(angles[(i + 6) % 10], r * phi, { center: { x: cx, y: 0 } })}A${
					r * phi
				} ${r * phi} 0 0 0 ${radialPointString(a + 180, r * phi, { center: { x: cx, y: 0 } })}Z`
		)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#INFINITISTAR {
				& circle,
				path:not(.Background) {
					stroke: black;
					fill: none;
				}
				& path.infinity {
					stroke-width: 5;
				}
				& path.segment {
					stroke-width: 5;
				}
				& path.star {
					fill: white;
					stroke-width: 2;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.1 100% 300)" />

	<g transform="rotate(-36)">
		{#each angles as a, i}
			<path
				d={`M${ix} 0L${radialPointString(a + 180, r * phi, { center: { x: cx, y: 0 } })}A${
					r * phi
				} ${r * phi} 0 0 1 ${radialPointString(a + 216, r * phi, { center: { x: cx, y: 0 } })}Z`}
				style={`stroke:black;stroke-width:3;fill:oklch(0.66 75% ${18 + (360 / paths.length) * i})`}
			/>
		{/each}
		{#each angles as a, i}
			<path
				d={`M${-ix} 0L${radialPointString(a, r * phi, { center: { x: -cx, y: 0 } })}A${r * phi} ${
					r * phi
				} 0 0 1 ${radialPointString(a + 36, r * phi, { center: { x: -cx, y: 0 } })}Z`}
				style={`stroke:black;stroke-width:3;fill:oklch(0.66 75% ${360 - (360 / paths.length) * i})`}
			/>
		{/each}

		{#each paths as d, i}
			<path
				{d}
				class="segment"
				style={`fill:oklch(0.75 75% ${180 + (360 / paths.length) * i} / 1)`}
			/>
		{/each}

		{#each angles.slice(0, 9) as a, i}
			<path
				class="star"
				d={starPath(r * phi ** 4, {
					rotate: i % 2 === 1 ? 180 : 0,
					center: radialPoint(a + 198, cx, { center: { x: cx, y: 0 } })
				})}
			/>
		{/each}
		{#each angles.slice(0, 9) as a, i}
			<path
				class="star"
				d={starPath(r * phi ** 4, {
					rotate: i % 2 === 0 ? 180 : 0,
					center: radialPoint(a + 18, cx, { center: { x: -cx, y: 0 } })
				})}
			/>
		{/each}

		<path
			d={`M0 ${-iy}A${r} ${r} 0 1 0 ${ix} 0A${r * phi} ${
				r * phi
			} 0 1 1 ${ix} 0.1A${r} ${r} 0 0 1 0 ${iy}A${r} ${r} 0 1 0 ${-ix} 0A${r * phi} ${
				r * phi
			} 0 1 0 ${-ix} 0.1A${r} ${r} 0 0 1 0 ${-iy}Z`}
			class="infinity"
		/>
	</g>
</DopplerSvg>
