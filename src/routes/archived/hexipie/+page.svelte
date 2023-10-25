<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 2, 20),
		updated_at: new Date(2023, 9, 2, 20)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { SQRT3, anglesArray, phi, pointToString, radialPoint } from '$lib/geometry';

	const id = 'HEXIPIE';
	const size = 2 ** 10;
	const r = size / 5;
	const angles = anglesArray(6, 0);
	const circles: Circle[] = [
		{ r: r * phi, x: 0, y: 0 },
		...angles.map((a, i) => ({ r: r * phi ** 2, ...radialPoint(a, r) })),
		...angles.map((a, i) => ({ r: r * phi, ...radialPoint(a - 30, r * SQRT3) }))
	];
	const lineArray: Line[] = [
		...angles.map(
			(_, i) =>
				[
					radialPoint(angles[i] - 30, r * SQRT3),
					radialPoint(angles[(i + 2) % 6] - 30, r * SQRT3)
				] as Line
		),
		...angles.map(
			(_, i) =>
				[
					radialPoint(angles[i] - 30, r * SQRT3),
					radialPoint(angles[(i + 1) % 6] - 30, r * SQRT3)
				] as Line
		),
		...angles.map((_, i) => [radialPoint(angles[i], r), { x: 0, y: 0 }] as Line)
	];
	const oc: Point[] = angles.map((a) => radialPoint(a - 30, r * SQRT3));
	const oa = [90, 120, 180, 210];
	const ic: Point[] = angles.map((a) => radialPoint(a, r));
	const ia = [60, 120, 180, 240, 300];
	const pathGroups: string[][][] = [
		oc.map((center, ci) =>
			oa.map(
				(a, ai) =>
					`M${pointToString(center)}L${pointToString(
						radialPoint(a + 60 * ci, r * phi, { center })
					)}A${r * phi} ${r * phi} 0 ${ai === 3 ? '1' : '0'} 1 ${pointToString(
						radialPoint(oa[(ai + 1) % 4] + 60 * ci, r * phi, { center })
					)}`
			)
		),
		ic.map((center, ci) =>
			ia.map(
				(a, ai) =>
					`M${pointToString(center)}L${pointToString(
						radialPoint(a + 60 * ci, r * phi ** 2, { center })
					)}A${r * phi ** 2} ${r * phi ** 2} 0 0 1 ${pointToString(
						radialPoint(ia[(ai + 1) % 5] + 60 * ci, r * phi ** 2, { center })
					)}`
			)
		),
		// .flat(),
		[
			[
				...angles.map(
					(a, i) =>
						`M0 0L${pointToString(radialPoint(a, r * phi))}A${r * phi} ${
							r * phi
						} 0 0 1 ${pointToString(radialPoint(angles[(i + 1) % 6], r * phi))}`
				)
			]
		]
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			.g0.i3 {
				fill: oklch(1 100% 30 / 1);
			}
			.g0.i0,
			.g0.i2 {
				fill: oklch(1 100% 45 / 1);
			}
			.g0.i1 {
				fill: oklch(1 100% 60 / 1);
			}
			.g1.i4 {
				fill: oklch(1 100% 75 / 1);
			}
			.g1.i0,
			.g1.i3 {
				fill: oklch(1 100% 90 / 1);
			}
			.g1.i1,
			.g1.i2 {
				fill: oklch(1 100% 105 / 1);
			}
			.g2 {
				fill: oklch(1 100% 135 / 1);
			}
		</style>
		<mask id="HEXIPIE-mask">
			<Background {size} fill="black" />
			{#each circles as c, i}
				<circle r={c.r} cx={c.x} cy={c.y} style="fill:white;" />
			{/each}
		</mask>
		<filter id="HEXIPIE-filter">
			<feTurbulence type="fractalNoise" baseFrequency="0.5 0.0001" />
			<feColorMatrix values="0" type="saturate" />
		</filter>
		<filter id="HEXIPIE-shrink">
			<feMorphology in="SourceGraphic" operator="erode" radius="8" result="erode8" />
			<feComposite in2="erode8" operator="in" result="c1" />
			<feMorphology operator="dilate" radius="3" result="dilate3" />
			<feFlood flood-color="oklch(0 0 0)" />
			<feComposite in2="dilate3" operator="in" />
			<feOffset dx="1" dy="3" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="c1" />
			</feMerge>
		</filter>
		<filter id="HEXIPIE-glow">
			<feMorphology operator="dilate" radius="2" result="dilate" />
			<feFlood flood-color="oklch(0.5 100% 300)" />
			<feComposite operator="in" in2="dilate" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 66% 300)" />
	<g transform="rotate(45)">
		<Background {size} fill="oklch(0 100% 300)" mask="url(#HEXIPIE-mask)" />
		<Background {size} filter="url(#HEXIPIE-filter)" mask="url(#HEXIPIE-mask)" />
		{#each pathGroups as group, gi}
			{#each group as g}
				{#each g as d, i}
					<path {d} class={`g${gi} i${i}`} filter="url(#HEXIPIE-shrink)" />
				{/each}
			{/each}
		{/each}
		<g filter="url(#HEXIPIE-glow)">
			<LineWithLegend {lineArray} style="stroke:oklch(0.75 75% 300);stroke-width:2;" />
		</g>
	</g>
</DopplerSvg>
