<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 3, 18),
		updated_at: new Date(2023, 9, 3, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, pathFromIntersectionsOfLines, phi, radialPoint } from '$lib/geometry';

	const id = 'TWO-FOLD-DODECA';
	const size = 2 ** 10;
	const angles = anglesArray(4, 0);
	const r = (size / 2) * 0.85;
	const radii = [r, r * phi, r * phi ** 2];
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [
		[
			{ x: -radii[0], y: 0 },
			{ x: radii[0], y: 0 }
		],
		[
			{ x: -radii[1], y: -radii[0] },
			{ x: -radii[1], y: radii[0] }
		],
		[
			{ x: radii[1], y: -radii[0] },
			{ x: radii[1], y: radii[0] }
		],
		[
			{ x: radii[1], y: -radii[0] },
			{ x: -radii[0], y: 0 }
		],
		[
			{ x: -radii[1], y: -radii[0] },
			{ x: radii[0], y: 0 }
		],
		[
			{ x: radii[1], y: radii[0] },
			{ x: -radii[0], y: 0 }
		],
		[
			{ x: -radii[1], y: radii[0] },
			{ x: radii[0], y: 0 }
		],

		[
			{ x: -radii[1], y: -radii[0] },
			{ x: 0, y: radii[1] }
		],
		[
			{ x: radii[1], y: -radii[0] },
			{ x: 0, y: radii[1] }
		],
		[
			{ x: -radii[1], y: radii[0] },
			{ x: 0, y: -radii[1] }
		],
		[
			{ x: radii[1], y: radii[0] },
			{ x: 0, y: -radii[1] }
		]
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines([
			'M',
			...[3, 7, 9, 5, 1, 9, 5, 7, 9, 3, 7, 1, 3].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[0, 4, 7, 8, 3, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[0, 5, 10, 9, 6, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[4, 8, 10, 6, 2, 10, 6, 8, 10, 4, 8, 2, 4].map((i) => lineArray[i]),
			'Z'
		])
	];
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.25 50% 300)" />
	<g transform="rotate(72)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style="stroke:oklch(1 0 0);fill:none;" />
		{/each}
		{#each paths as d, i}
			<path
				{d}
				style={`stroke-linejoin:bevel;stroke:oklch(0 0 0);stroke-width:10;fill-rule:evenodd;fill:oklch(${
					1 - 0.15 * i
				} 100% 100 / 0.75)`}
			/>
		{/each}
	</g>
</DopplerSvg>
