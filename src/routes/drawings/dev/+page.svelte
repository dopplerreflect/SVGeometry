<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 13, 11),
		updated_at: new Date(2023, 10, 13, 11)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		circleIntersections,
		phi,
		pointToString,
		radialPointString
	} from '$lib/geometry';

	const id = 'DEV';
	const size = 2 ** 10;
	const r0 = size * phi ** 3;
	const r1 = r0 * Phi;
	const d = (r1 - r0) / 8;
	const radii = arrayMap(8, (n) => n).map((n) => r0 + d * n);
	const circles: Circle[] = radii
		.map((r) => [
			{ r, x: -r0 / 2, y: 0 },
			{ r, x: r0 / 2, y: 0 }
		])
		.flat();
	const ad = 24;
	const angles = [...Array(ad + 1).keys()].map((i) => -71 + (71 / ad) * i);
	const ys: number[] = [];
	for (let y = 0; y <= r1; y += d) {
		ys.push(y);
	}
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="DEV-shadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="2" />
			<feGaussianBlur stdDeviation="8" />
			<feOffset dy="4" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<mask id="DEV-mask">
			<Background {size} fill="oklch(1 0 0 / 0.25)" />
			<path
				d={`M${pointToString(circleIntersections(circles[15], circles[0])[1])}A${r1 - d} ${
					r1 - d
				} 0 0 1 ${pointToString(circleIntersections(circles[14], circles[15])[0])}A${r1 - d} ${
					r1 - d
				} 0 0 1 ${pointToString(circleIntersections(circles[14], circles[1])[0])}A${r1 - d} ${
					r1 - d
				} 0 0 0 ${pointToString(circleIntersections(circles[0], circles[1])[0])}A${r1 - d} ${
					r1 - d
				} 0 0 0 ${pointToString(circleIntersections(circles[15], circles[0])[1])}`}
				style="fill:oklch(1 0 0 / 0.5)"
			/>
		</mask>
		<style>
			svg#DEV {
				& circle {
					stroke: white;
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0 100% 210)" />
	<g transform="rotate(0)">
		<line x1={-size / 2} x2={size / 2} style="stroke:oklch(1 0 0 / 0.5)" />
		<line y1={-size / 2} y2={size / 2} style="stroke:oklch(1 0 0 / 0.5)" />

		{#each radii.slice(0, radii.length - 1) as r, i}
			<path
				d={`M${r0 / 2 - r} 0v${r}H${-r0 / 2 + r}V0A${r} ${r} 0 0 0 ${pointToString(
					circleIntersections(circles[i * 2], circles[i * 2 + 1])[0]
				)}A${r} ${r} 0 0 0 ${r0 / 2 - r} 0M${r0 / 2 - radii[i + 1]} 0v${radii[i + 1]}H${
					-r0 / 2 + radii[i + 1]
				}V0A${radii[i + 1]} ${radii[i + 1]} 0 0 0 ${pointToString(
					circleIntersections(circles[i * 2 + 2], circles[i * 2 + 3])[0]
				)}A${radii[i + 1]} ${radii[i + 1]} 0 0 0 ${r0 / 2 - radii[i + 1]} 0Z`}
				style={`stroke:oklch(1 0 0 / 0.5);fill:oklch(75% 100% ${
					30 + 51.4 * i
				} / 0.75);fill-rule:evenodd`}
				filter="url(#DEV-shadow)"
			/>
		{/each}
		<g mask="url(#DEV-mask)">
			{#each circles as c}
				<circle r={c.r} cx={c.x} cy={c.y} style="stroke:oklch(1 0 0 / 0.5);stroke-width:2" />
			{/each}
		</g>
		<path
			d={`M${-size / 2} ${-size / 2}h${size}v${size}h${-size}V${-size}M${r0 / 2 - r1 + d} 0v${
				r1 - d
			}H${-r0 / 2 + r1 - d}V0A${r1 - d} ${r1 - d} 0 0 0 ${pointToString(
				circleIntersections(circles[14], circles[15])[0]
			)}A${r1 - d} ${r1 - d} 0 0 0 ${r0 / 2 - r1 + d} 0Z`}
			style={`fill:oklch(0.5 100% 210 / 0.1);fill-rule:evenodd`}
			filter="url(#DEV-shadow)"
		/>
	</g>
	<g id="stones" style="display:none;stroke:oklch(0.5 0 0);fill:oklch(1 0 0 / 1);">
		{#each angles.slice(0, angles.length - 1) as a, i}
			<path
				d={`M${radialPointString(a, r1 - d, { center: { x: -r0 / 2, y: 0 } })} ${
					i === 0 ? `0 ${-r1 + d} ` : radialPointString(a, r1, { center: { x: -r0 / 2, y: 0 } })
				}A${r1} ${r1} 0 0 1 ${radialPointString(angles[i + 1], r1, {
					center: { x: -r0 / 2, y: 0 }
				})}L${radialPointString(angles[i + 1], r1 - d, { center: { x: -r0 / 2, y: 0 } })}A${
					r1 - d
				} ${r1 - d} 0 0 0 ${radialPointString(a, r1 - d, { center: { x: -r0 / 2, y: 0 } })}`}
			/>
			<path
				d={`M${radialPointString(a, r1 - d, { center: { x: -r0 / 2, y: 0 } })} ${
					i === 0 ? `0 ${-r1 + d} ` : radialPointString(a, r1, { center: { x: -r0 / 2, y: 0 } })
				}A${r1} ${r1} 0 0 1 ${radialPointString(angles[i + 1], r1, {
					center: { x: -r0 / 2, y: 0 }
				})}L${radialPointString(angles[i + 1], r1 - d, { center: { x: -r0 / 2, y: 0 } })}A${
					r1 - d
				} ${r1 - d} 0 0 0 ${radialPointString(a, r1 - d, { center: { x: -r0 / 2, y: 0 } })}`}
				transform="scale(-1 1)"
			/>
		{/each}
		{#each ys.slice(0, ys.length - 1) as y, i}
			<path d={`M${r1 / 2 + 3 * d} ${y}h${d}v${d}h${-d}Z`} />
			<path d={`M${r1 / 2 + 3 * d} ${y}h${d}v${d}h${-d}Z`} transform="scale(-1 1)" />
		{/each}
		<path
			d={`M${-r0 - d / 2 - d - 1} ${r1 - d}H${r0 + d / 2 + d + 1}v${d}H${-r0 - d / 2 - d - 1}Z`}
		/>
	</g>
</DopplerSvg>
