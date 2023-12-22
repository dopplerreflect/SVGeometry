<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 21),
		updated_at: new Date(2023, 11, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		circleIntersections as ci,
		circleLineIntersections as cli,
		phi,
		pointToString,
		polygon,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'ICOSADODECA';
	const size = 2 ** 10;
	const angles = anglesArray(10, -162);
	const r = (size * phi) / 10;
	const radii = arrayMap(4, (n) => r * Phi ** n);
	const c: Circle[] = [
		...angles.map((a, i) => [
			...radii.slice(0, 2).map((r, ri) => ({ r, ...radialPoint(a, radii[2]) })),
			...radii.slice(0, 3).map((r, ri) => ({ r, ...radialPoint(a, radii[3]) })),
			{ r: radii[3] - (radii[2] - radii[1] * 0.9098300562505258), ...radialPoint(a, radii[3]) }
		])
	].flat();

	const l: Line[] = [
		...angles.slice(0).map((a) => [
			[{ x: 0, y: 0 }, radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))] as Line,
			[
				radialPoint(a + 72, radii[0], { center: radialPoint(a, radii[2]) }),
				radialPoint(a + 72, radii[0], {
					center: radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))
				})
			] as Line,
			[
				radialPoint(a - 72, radii[0], { center: radialPoint(a, radii[2]) }),
				radialPoint(a - 72, radii[0], {
					center: radialPoint(a, radii[3] * 2 - (radii[2] - radii[1]))
				})
			] as Line
		])
	].flat();

	const polygonPoints: string[] = [
		[
			ci(c[12], c[15])[1],
			ci(c[12], c[15])[0],
			ci(c[13], c[16])[0],
			ci(c[7], c[16])[1],
			ci(c[13], c[16])[1]
		],

		[
			ci(c[24], c[27])[1],
			ci(c[24], c[27])[0],
			ci(c[25], c[28])[0],
			ci(c[19], c[28])[1],
			ci(c[25], c[28])[1]
		],
		[
			ci(c[36], c[39])[1],
			ci(c[36], c[39])[0],
			ci(c[37], c[40])[0],
			ci(c[31], c[40])[1],
			ci(c[37], c[40])[1]
		],
		[
			ci(c[48], c[51])[1],
			ci(c[48], c[51])[0],
			ci(c[49], c[52])[0],
			ci(c[43], c[52])[1],
			ci(c[49], c[52])[1]
		],
		[
			ci(c[0], c[3])[1],
			ci(c[0], c[3])[0],
			ci(c[1], c[4])[0],
			ci(c[55], c[4])[1],
			ci(c[1], c[4])[1]
		],
		[ci(c[18], c[21])[0], ci(c[18], c[21])[1], ci(c[13], c[25])[0]],
		[ci(c[13], c[25])[0], ci(c[19], c[28])[1], ci(c[7], c[16])[1]],

		[ci(c[30], c[33])[0], ci(c[30], c[33])[1], ci(c[25], c[37])[0]],
		[ci(c[25], c[37])[0], ci(c[31], c[40])[1], ci(c[19], c[28])[1]],

		[ci(c[42], c[45])[0], ci(c[42], c[45])[1], ci(c[37], c[49])[0]],
		[ci(c[37], c[49])[0], ci(c[43], c[52])[1], ci(c[31], c[40])[1]],

		[ci(c[54], c[57])[0], ci(c[54], c[57])[1], ci(c[1], c[49])[1]],
		[ci(c[49], c[1])[0], ci(c[55], c[4])[1], ci(c[43], c[52])[1]],

		[ci(c[6], c[9])[0], ci(c[6], c[9])[1], ci(c[1], c[13])[0]],
		[ci(c[1], c[13])[0], ci(c[7], c[16])[1], ci(c[7], c[0])[0]],
		[
			ci(c[7], c[19])[1],
			ci(c[19], c[31])[1],
			ci(c[31], c[43])[1],
			ci(c[43], c[55])[1],
			ci(c[55], c[7])[1]
		]
	].map((o) => o.map((e) => pointToString(e)).join(' '));

	function isHiddenBasedOnPolygonAndAngleIndices(angle: number, polygonIndex: number): boolean {
		const hiddenIndices = hiddenMap.get(angle);
		if (hiddenIndices && hiddenIndices.includes(polygonIndex)) {
			return true;
		}
		return false;
	}

	const hiddenMap = new Map();
	hiddenMap.set(-126, [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
	hiddenMap.set(-54, [2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14]);
	hiddenMap.set(18, [0, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]);
	hiddenMap.set(90, [0, 1, 4, 5, 6, 7, 8, 11, 12, 13, 14]);
	hiddenMap.set(162, [0, 1, 2, 5, 6, 7, 8, 9, 10, 13, 14]);
	hiddenMap.set(-90, [11]);
	hiddenMap.set(-18, [13]);
	hiddenMap.set(54, [5]);
	hiddenMap.set(126, [7, 13]);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="ICOSADODECA-alpha-filter">
			<feColorMatrix
				values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.66 0"
			/>
		</filter>
		<filter id="ICOSADODECA-glow">
			<feGaussianBlur stdDeviation="2" result="tightblur" />
			<feMorphology operator="dilate" radius="1" in="SourceGraphic" />
			<feGaussianBlur stdDeviation="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="tightblur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="ICOSADODECA-lg" r="75%">
			<stop offset="0%" stop-color="oklch(0.5 100% calc(var(--hue) + 120))" />
			<stop offset="100%" stop-color="oklch(0.05 100% calc(var(--hue) + 120))" />
		</radialGradient>
		<style>
			svg#ICOSADODECA {
				--lightness: 0.66;
				--chroma: 100%;
				--hue: 210;
				& polygon {
					stroke-width: 2;
				}
				& polygon.clear {
					fill: none;
					stroke: oklch(0.99 100% calc(var(--hue) - 30));

					filter: url(#ICOSADODECA-glow);
				}
				& polygon.pi-0 {
					fill: oklch(var(--lightness) var(--chroma) var(--hue));
				}
				& polygon.pi-5,
				& polygon.pi-6,
				& polygon.pi-13,
				& polygon.pi-14 {
					fill: oklch(calc(var(--lightness) - 0.1) var(--chroma) var(--hue));
				}
				& polygon.pi-1,
				& polygon.pi-4,
				& polygon.pi-15 {
					fill: oklch(calc(var(--lightness) - 0.2) var(--chroma) var(--hue));
				}
				& polygon.pi-8,
				& polygon.pi-12 {
					fill: oklch(calc(var(--lightness) - 0.3) var(--chroma) var(--hue));
				}
				& polygon.pi-7,
				& polygon.pi-10,
				& polygon.pi-11 {
					fill: oklch(calc(var(--lightness) - 0.35) var(--chroma) var(--hue));
				}
				& polygon.pi-2,
				& polygon.pi-3 {
					fill: oklch(calc(var(--lightness) - 0.4) var(--chroma) var(--hue));
				}
				& polygon.pi-9 {
					fill: oklch(calc(var(--lightness) - 0.45) var(--chroma) var(--hue));
				}
				& circle {
					stroke: oklch(0.99 100% calc(var(--hue) + 120));
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="url(#ICOSADODECA-lg)" />

	<g id="circles" filter="url(#ICOSADODECA-glow)">
		{#each c as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
	</g>

	<g id="whole" filter="url(#ICOSADODECA-alpha-filter)">
		<g id="odd">
			{#each angles.filter((a, i) => i % 2 == 1) as a, ai}
				<g transform={`translate(${radialPointString(a, radii[3])})`}>
					{#each polygonPoints as points, pi}
						{#if !isHiddenBasedOnPolygonAndAngleIndices(a, pi)}
							<polygon {points} class="pi-{pi}" />
							<polygon {points} class="clear" />
						{/if}
					{/each}
				</g>
			{/each}
		</g>
		<g id="even">
			{#each angles.filter((a, i) => i % 2 == 0) as a, ai}
				{#each polygonPoints as points, pi}
					<g transform={`translate(${radialPointString(a, radii[3])})`}>
						{#if !isHiddenBasedOnPolygonAndAngleIndices(a, pi)}
							<polygon {points} class="pi-{pi}" />
							<polygon {points} class="clear" />
						{/if}
					</g>
				{/each}
			{/each}
		</g>
		<g id="triangles">
			{#each angles.filter((a, i) => i % 2 === 0) as a}
				<polygon
					points={[ci(c[18], c[21])[0], ci(c[18], c[21])[1], ci(c[16], c[19])[0]]
						.map((e) => pointToString(e))
						.join(' ')}
					class="pi-1"
					transform={`rotate(${a + 18})`}
				/>
				<polygon
					points={[ci(c[18], c[21])[0], ci(c[18], c[21])[1], ci(c[16], c[19])[0]]
						.map((e) => pointToString(e))
						.join(' ')}
					class="clear"
					transform={`rotate(${a + 18})`}
				/>
			{/each}
		</g>
		<g id="center">
			{#each polygonPoints as points, pi}
				<polygon {points} class="pi-{pi}" />
				<polygon {points} class="clear" />
			{/each}
		</g>
	</g>
</DopplerSvg>
