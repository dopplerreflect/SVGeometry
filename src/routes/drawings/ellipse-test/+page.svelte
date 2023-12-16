<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 14),
		updated_at: new Date(2023, 9, 14)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { linePoints, phi } from '$lib/geometry';

	const { cos, sin, PI } = Math;

	const D = 2 * PI;

	const id = 'TEMPLATE';
	const size = 2 ** 10;

	const xl = (size / 2) * phi,
		xs = (size / 2) * phi ** 5,
		divs = 30,
		vd = 24;

	const ellipse = (center: Point, x: number, y: number, divs: number): Point[] => {
		const points = [];
		const T = x / y;
		for (let i = 0; i < divs; i++) {
			const angle = D * 0.75 + (D / divs) * i; // start at 270°
			points.push({ x: center.x + sin(angle) * y * T, y: center.y + cos(angle) * y });
		}
		return points;
	};
	const lo: Line = [
		{ x: xs, y: (-size / 2) * phi },
		{ x: xl, y: (size / 2) * phi }
	];
	const lp: Point[] = linePoints(lo, vd, true);
	const ellipses: Point[][] = lp.map((p, i) =>
		ellipse({ x: 0, y: p.y }, p.x, (i + 1) * (100 / vd), divs)
	);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle {
					stroke: white;
					fill: none;
				}
				& line {
					stroke: oklch(0.5 0 0);
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each ellipses.slice(0, ellipses.length - 1) as ellipse, ei}
		{#each ellipse as p, i}
			<path
				d={`M${p.x} ${p.y} ${ellipse[(i + 1) % ellipse.length].x} ${
					ellipse[(i + 1) % ellipse.length].y
				} 
        ${ellipses[ei + 1][(i + 1) % ellipse.length].x} ${
					ellipses[ei + 1][(i + 1) % ellipse.length].y
				} 
        ${ellipses[ei + 1][i].x} ${ellipses[ei + 1][i].y}Z`}
				style={`stroke-width:4;stroke:${i % 2 === 0 ? 'none' : 'oklch(0.2 0 0)'};fill:${
					i % 2 === 0
						? `none`
						: `oklch(${i < ellipse.length / 2 ? 0.99 : 0.75} 100% ${
								30 + (360 / ellipses.length) * ei
						  } / 1)`
				};`}
			/>
		{/each}
	{/each}
</DopplerSvg>
