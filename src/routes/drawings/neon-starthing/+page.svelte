<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 2),
		updated_at: new Date(2023, 11, 2)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, phi, radialPoint, starPath } from '$lib/geometry';

	const id = 'NEON-STARTHING';
	const size = 2 ** 10;
	const r = size * 0.2;
	const rotate: 0 | 36 = 0;
	const radii = arrayMap(4, (n) => r * phi ** n);
	const angles = anglesArray(10);
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii
			.slice(0, 4)
			.map((r) =>
				angles
					.filter((_, i) => i % 2 === 0)
					.map((ia, ii) =>
						angles
							.filter((_, i) => i % 2 === 0)
							.map((oa, oi) => ({
								r,
								...radialPoint(ia, radii[2], { center: radialPoint(oa, radii[0]) })
							}))
					)
			)
			.flat(2)
	];
	const colors = new Map();
	radii.forEach((r, i) => colors.set(r, `oklch(0.66 100% ${330 + i * 90})`));
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="NEON-STARTHING-glow">
			<feGaussianBlur stdDeviation="1" />
			<feColorMatrix
				values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0.25"
				result="lightglow"
			/>
			<feGaussianBlur in="SourceGraphic" stdDeviation="2" />
			<feColorMatrix
				values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0.25"
			/>
			<feMerge>
				<feMergeNode />
				<feMergeNode in="lightglow" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	{#each circles as c}
		<circle
			r={c.r}
			cx={c.x}
			cy={c.y}
			style="stroke:oklch(0.5 0 0);fill:oklch(0.5 100% 330 / 0.125)"
		/>
	{/each}
	<g filter="url(#NEON-STARTHING-glow)">
		{#each circles as c}
			<path
				d={starPath(c.r, { center: { x: c.x, y: c.y }, rotate })}
				style={`stroke:${colors.get(c.r)};stroke-width:${1};stroke-linejoin:bevel;fill:none;`}
			/>
		{/each}
	</g>
	{#each circles as c}
		<path
			d={starPath(c.r, { center: { x: c.x, y: c.y }, rotate })}
			style={`stroke:oklch(1 0 0);stroke-width:${1};stroke-linejoin:bevel;fill:none;`}
		/>
	{/each}
</DopplerSvg>
