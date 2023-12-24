<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 23, 16),
		updated_at: new Date(2023, 11, 23, 16)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		arrayMap,
		circleIntersections,
		phi,
		pointToString,
		radialPoint,
		radialPointString,
		starPath
	} from '$lib/geometry';

	const id = 'WREATH';
	const size = 2 ** 10;
	const angles = anglesArray(10);
	const angles2 = anglesArray(20);

	const r = size * 0.35;
	const circles: Circle[] = [...angles.map((a) => ({ r, ...radialPoint(a, r * phi ** 2) }))];
	const intersections: Point[] = circles
		.map((c1, i1) => circles.map((c2, i2) => circleIntersections(c1, c2)[0]))
		.flat()
		.filter((c) => !isNaN(c.x));
	const arcPathBetweenPoints = (points: [Point, number][], radius: number = r): string => {
		let result = `M${pointToString(points[0][0])}A${radius} ${radius} 0 0 ${points[0][1]} `;
		points.slice(1, points.length).forEach((p) => {
			result += `${pointToString(p[0])}A${radius} ${radius} 0 0 ${p[1]}`;
		});
		result += pointToString(points[0][0]) + 'Z';
		return result;
	};
	const pathsArray: [Point, number][][] = [
		[
			[intersections[0], 1],
			[intersections[10], 0],
			[intersections[1], 0]
		],
		[
			[intersections[1], 1],
			[intersections[10], 1],
			[intersections[11], 0],
			[intersections[2], 0]
		],
		[
			[intersections[2], 1],
			[intersections[11], 1],
			[intersections[12], 0],
			[intersections[3], 0]
		],
		[
			[intersections[3], 1],
			[intersections[12], 1],
			[intersections[13], 0],
			[intersections[4], 0]
		],
		[
			[intersections[4], 1],
			[intersections[13], 1],
			[intersections[14], 0],
			[intersections[5], 0]
		],
		[
			[intersections[5], 1],
			[intersections[14], 1],
			[intersections[15], 0],
			[intersections[6], 0]
		],
		[
			[intersections[6], 1],
			[intersections[15], 1],
			[intersections[16], 0],
			[intersections[7], 0]
		],
		[
			[intersections[7], 1],
			[intersections[16], 1],
			[intersections[17], 0],
			[intersections[8], 0]
		],
		[
			[intersections[8], 1],
			[intersections[17], 1],
			[intersections[9], 0]
		]
	];
	const paths = pathsArray.map((p) => arcPathBetweenPoints(p));
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#WREATH {
				--hue: 30;
			}
		</style>
		<g id="WREATH-arm">
			{#each paths as d, i}
				<path {d} filter="url(#WREATH-shrink)" />
			{/each}
		</g>
		<filter id="WREATH-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="2" />
			<feGaussianBlur stdDeviation="1" />
			<feOffset dy="3" result="shadow" />
			<feMorphology in="SourceAlpha" operator="erode" radius="3" result="smallErode" />
			<feFlood flood-color="oklch(0.99 50% calc(var(--hue) + 0))" result="color" />
			<feComposite operator="in" in2="smallErode" result="border" />
			<feMorphology in="SourceGraphic" operator="erode" radius="4" result="bigErode" />
			<feMerge>
				<feMergeNode in="shadow" />
				<feMergeNode in="border" />
				<feMergeNode in="bigErode" />
			</feMerge>
		</filter>
		<filter id="WREATH-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="WREATH-rg" fr="15.5%" r="50%">
			<stop offset="0%" stop-color={`oklch(0.2 100% var(--hue) / 0)`} />
			<stop offset="61%" stop-color={`oklch(0.99 100% var(--hue) )`} />
			<stop offset="100%" stop-color={`oklch(0.2 100% var(--hue) / 0)`} />
		</radialGradient>
		<radialGradient id="WREATH-rg2" fr="15.5%" r="50%">
			<stop offset="0%" stop-color={`oklch(0.01 50% var(--hue) / 0)`} />
			<stop offset="61%" stop-color={`oklch(0.99 50% var(--hue) / 0.5)`} />
			<stop offset="100%" stop-color={`oklch(0.01 50% var(--hue) / 0)`} />
		</radialGradient>
		<filter id="WREATH-distort" x="-50%" y="-50%" width="200%" height="200%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.5"
				numOctaves="2"
				seed="8"
				result="noise"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="noise"
				scale="8"
				xChannelSelector="R"
				yChannelSelector="G"
				result="distort"
			/>
			<feGaussianBlur stdDeviation="5" />
			<feColorMatrix
				values="1 0 0 0 1
                0 1 0 0 1
                0 0 1 0 1
                0 0 0 1 0.0825"
			/>
			<feMerge>
				<feMergeNode />
				<feMergeNode in="distort" />
			</feMerge>
		</filter>
		<mask id="WREATH-radialmask">
			<radialGradient id="WREATH-rmrg">
				<stop offset="0%" stop-color="white" />
				<stop offset="100%" stop-color="oklch(0.5 0 0)" />
			</radialGradient>
			<Background {size} fill="url(#WREATH-rmrg)" />
		</mask>
	</defs>
	<Background {size} fill="oklch(0.90 12.5% calc(var(--hue) + 120))" />
	<g filter="url(#WREATH-distort)" mask="url(#WREATH-radialmask)">
		{#each angles2 as a}
			<path
				d={`M${radialPointString(a, r * phi ** 5)} ${radialPointString(
					a,
					(size / 2) * Math.sqrt(2)
				)}`}
				style={`stroke:oklch(0.4 100% calc(var(--hue) + 120));stroke-width:10;`}
			/>
		{/each}
	</g>
	<g filter="url(#WREATH-glow)" transform="rotate(0)">
		{#each circles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`fill:none;stroke:oklch(0.99 50% calc(var(--hue) + 0) / 1)`}
			/>
		{/each}
	</g>
	<Background {size} fill="url(#WREATH-rg)" />
	{#each angles as a, i}
		<use
			style={`fill:oklch(${i % 2 === 0 ? 0.125 : 0.99} ${i % 2 === 0 ? 100 : 0}% var(--hue) );`}
			href="#WREATH-arm"
			transform={`rotate(${a + 18})`}
		/>
	{/each}
	<Background {size} fill="url(#WREATH-rg2)" />
	<path
		filter="url(#WREATH-glow)"
		d={starPath(r * phi ** 2)}
		style="fill: oklch(0.99 50% calc(var(--hue) + 60) / 0.75);stroke:oklch(0.99 100% calc(var(--hue) + 60));stroke-width:8;"
	/>
</DopplerSvg>
