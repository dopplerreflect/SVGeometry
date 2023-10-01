<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 30, 9),
		updated_at: new Date(2023, 8, 30, 17)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		phi,
		pythag2,
		radialPoint,
		radialPointString,
		starPath
	} from '$lib/geometry';

	const id = 'INFINITISTAR';
	const size = 2 ** 10;
	const r = (size / 4) * 1.1;
	const r2 = r * phi;
	const ix = (r - r2) / 2;
	const cx = r - ix;
	const iy = pythag2(r, cx);
	const cr = { x: cx, y: 0 };
	const cl = { x: -cx, y: 0 };
	const angles = anglesArray(10, 0);
	const angles20 = anglesArray(20, 0);
	const paths: string[] = [
		`M${radialPointString(angles[4], r, {
			center: cr
		})}A${r} ${r} 0 0 1 ${radialPointString(angles[5], r, {
			center: cr
		})}L${radialPointString(angles[5], r2, {
			center: cr
		})}A${r2} ${r2} 0 0 0 ${radialPointString(angles[4], r2, { center: cr })}`,
		...angles.slice(0, 10).map(
			(a, i) =>
				`M${radialPointString(-a, r, {
					center: cl
				})}A${r} ${r} 0 0 0 ${radialPointString(-angles[(i + 1) % 10], r, {
					center: cl
				})}L${radialPointString(-angles[(i + 1) % 10], r2, {
					center: cl
				})}A${r2} ${r2} 0 0 1 ${radialPointString(-a, r2, { center: cl })}Z`
		),
		...angles.slice(0, 9).map(
			(a, i) =>
				`M${radialPointString(a - 180, r, {
					center: cr
				})}A${r} ${r} 0 0 1 ${radialPointString(angles[(i + 6) % 10], r, {
					center: cr
				})}L${radialPointString(angles[(i + 6) % 10], r2, {
					center: cr
				})}A${r2} ${r2} 0 0 0 ${radialPointString(a + 180, r2, { center: cr })}Z`
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
				& path.segment {
					stroke-width: 5;
				}
				& path.star {
					fill: white;
					stroke-width: 2;
				}
			}
		</style>
		<mask id="INFINITISTARS-mask">
			<Background {size} fill="black" />
			<rect
				x={(-size / 2) * 0.975}
				y={(-size / 2) * 0.975}
				width={size * 0.975}
				height={size * 0.975}
				rx={r * phi ** 3}
				style="fill:white;"
			/>
		</mask>
	</defs>
	<Background {size} fill="oklch(0.1 100% 300)" />

	<g mask="url(#INFINITISTARS-mask)">
		{#each angles.slice(0, 8) as a, i}
			<path
				d={`M${radialPointString(angles20[(i + 13) % 20] + 4.5 * i, size)} ${radialPointString(
					angles[(i + 5) % 10],
					r,
					{
						center: radialPoint(-36, cx)
					}
				)}A${r} ${r} 0 0 1 ${radialPointString(angles[(i + 6) % 10], r, {
					center: radialPoint(-36, cx)
				})}L${radialPointString(angles20[(i + 14) % 20] + 4.5 + 4.5 * i, size)}Z`}
				style={`fill:oklch(0.66 75% ${342 - (360 / 20) * i});stroke-width:5;`}
			/>
		{/each}

		{#each angles.slice(0, 8) as a, i}
			<path
				d={`M${radialPointString(angles20[(i + 23) % 20] + 4.5 * i, size)} ${radialPointString(
					angles[i % 10],
					r,
					{
						center: radialPoint(-36, -cx)
					}
				)}A${r} ${r} 0 0 1 ${radialPointString(angles[(i + 1) % 10], r, {
					center: radialPoint(-36, -cx)
				})}L${radialPointString(angles20[(i + 24) % 20] + 4.5 + 4.5 * i, size)}Z`}
				style={`fill:oklch(0.66 75% ${36 + (360 / 20) * i} / 1);stroke-width:5;`}
			/>
		{/each}

		<g transform="rotate(-36)">
			{#each angles as a, i}
				<path
					d={`M${ix} 0L${radialPointString(a + 180, r2, {
						center: cr
					})}A${r2} ${r2} 0 0 1 ${radialPointString(a + 216, r2, { center: cr })}Z`}
					style={`stroke-width:3;fill:oklch(0.66 75% ${18 + (360 / paths.length) * i})`}
				/>
			{/each}
			{#each angles as a, i}
				<path
					d={`M${-ix} 0L${radialPointString(a, r2, {
						center: cl
					})}A${r2} ${r2} 0 0 1 ${radialPointString(a + 36, r2, { center: cl })}Z`}
					style={`stroke-width:3;fill:oklch(0.66 75% ${360 - (360 / paths.length) * i})`}
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
						center: radialPoint(a + 198, cx, { center: cr })
					})}
				/>
			{/each}
			{#each angles.slice(0, 9) as a, i}
				<path
					class="star"
					d={starPath(r * phi ** 4, {
						rotate: i % 2 === 0 ? 180 : 0,
						center: radialPoint(a + 18, cx, { center: cl })
					})}
				/>
			{/each}
		</g>
	</g>
	<rect
		x={(-size / 2) * 0.975}
		y={(-size / 2) * 0.975}
		width={size * 0.975}
		height={size * 0.975}
		rx={r * phi ** 3}
		style="fill:none;stroke:white;stroke-width:5;"
	/>
</DopplerSvg>
