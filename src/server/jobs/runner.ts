import { jobStore } from './store.ts';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const jitter = (base: number, spread = 0.4) =>
	Math.round(base * (1 - spread / 2 + Math.random() * spread));

const PIPELINE = [
	{
		cmd: 'npm install',
		lines: [
			[320, 'info', 'Resolving packages...'],
			[480, 'info', 'Fetching 142 packages...'],
			[650, 'info', 'Linking dependencies...'],
			[220, 'success', '✓ Done in 1.7s'],
		],
	},
	{
		cmd: 'tsc --noEmit',
		lines: [
			[380, 'info', 'Checking 14 source files...'],
			[580, 'success', '✓ No type errors found'],
		],
	},
	{
		cmd: 'biome check .',
		lines: [
			[180, 'info', 'Checking 18 files...'],
			[340, 'success', '✓ No lint errors'],
		],
	},
	{
		cmd: 'esbuild src/client/entry.tsx --bundle --outdir=public/assets',
		lines: [
			[280, 'info', 'Bundling entry point...'],
			[190, 'info', '  public/assets/entry.js   163.8kb'],
			[120, 'success', '✓ Done in 12ms'],
		],
	},
] as const;

export async function runJob(id: string) {
	jobStore.setStatus(id, 'running');

	try {
		for (const step of PIPELINE) {
			await sleep(jitter(250));
			jobStore.log(id, `$ ${step.cmd}`, 'cmd');
			for (const [delay, level, text] of step.lines) {
				await sleep(jitter(delay));
				jobStore.log(id, text, level);
			}
		}
		await sleep(jitter(300));
		jobStore.log(id, '✓ Pipeline complete', 'success');
		jobStore.setStatus(id, 'success');
	} catch (err) {
		jobStore.log(id, `✗ ${String(err)}`, 'error');
		jobStore.setStatus(id, 'failed');
	}
}
