import { jobStore } from './store.ts';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const PIPELINE = [
	{
		cmd: 'npm install',
		lines: [
			[300, 'info', 'Resolving packages...'],
			[500, 'info', 'Fetching 142 packages...'],
			[700, 'info', 'Linking dependencies...'],
			[200, 'success', '✓ Done in 1.7s'],
		],
	},
	{
		cmd: 'tsc --noEmit',
		lines: [
			[400, 'info', 'Checking 14 source files...'],
			[600, 'success', '✓ No type errors found'],
		],
	},
	{
		cmd: 'biome check .',
		lines: [
			[200, 'info', 'Checking 18 files...'],
			[300, 'success', '✓ No lint errors'],
		],
	},
	{
		cmd: 'esbuild src/client/entry.tsx --bundle --outdir=public/assets',
		lines: [
			[300, 'info', 'Bundling entry point...'],
			[200, 'info', '  public/assets/entry.js   163.8kb'],
			[100, 'success', '✓ Done in 12ms'],
		],
	},
] as const;

export async function runJob(id: string) {
	jobStore.setStatus(id, 'running');

	try {
		for (const step of PIPELINE) {
			await sleep(250);
			jobStore.log(id, `$ ${step.cmd}`, 'cmd');
			for (const [delay, level, text] of step.lines) {
				await sleep(delay);
				jobStore.log(id, text, level);
			}
		}
		await sleep(300);
		jobStore.log(id, '✓ Pipeline complete', 'success');
		jobStore.setStatus(id, 'success');
	} catch (err) {
		jobStore.log(id, `✗ ${String(err)}`, 'error');
		jobStore.setStatus(id, 'failed');
	}
}
