import fs from 'node:fs/promises';

console.log(process.argv[2]);

fs.mkdir(`./src/routes/drawings/${process.argv[2]}`).then(() => {
	fs.cp('./+page.template.svelte', `./src/routes/drawings/${process.argv[2]}/+page.svelte`);
});
