import type { PipelineType } from './store.ts';
import { jobStore } from './store.ts';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const jitter = (base: number, spread = 0.4) =>
	Math.round(base * (1 - spread / 2 + Math.random() * spread));

type StepLine = readonly [number, string, string];

type Step = {
	cmd: string;
	lines: readonly StepLine[];
	failChance?: number;
	failLines?: readonly StepLine[];
};

const PIPELINES: Record<PipelineType, readonly Step[]> = {
	lint: [
		{
			cmd: 'biome check --write .',
			lines: [
				[1400, 'info', 'Checking 24 files...'],
				[900, 'info', 'Applying safe fixes...'],
				[2800, 'success', '✓ No remaining issues'],
			],
			failChance: 0.35,
			failLines: [
				[
					1200,
					'error',
					'src/utils/format.ts:8:7 lint/correctness/noUnusedVariables',
				],
				[400, 'error', '  ✖ This variable is unused.'],
				[400, 'error', '  8 │ const locale = new Intl.NumberFormat("en-US")'],
				[400, 'error', '    │       ^^^^^^'],
				[800, 'error', 'Found 1 error.'],
			],
		},
	],

	frontend: [
		{
			cmd: 'npm install',
			lines: [
				[1800, 'info', 'Resolving packages...'],
				[2400, 'info', 'Fetching 142 packages...'],
				[1600, 'info', 'Linking dependencies...'],
				[600, 'success', '✓ Done in 6.4s'],
			],
		},
		{
			cmd: 'tsc --noEmit',
			lines: [[3200, 'info', 'Checking 32 source files...']],
			failChance: 0.25,
			failLines: [
				[1800, 'error', 'src/components/UserCard.tsx:23:9 - error TS2322'],
				[
					400,
					'error',
					"  Type 'string | null' is not assignable to type 'string'.",
				],
				[400, 'error', '  23     <UserCard name={user.name} />'],
				[400, 'error', '                        ~~~~~~~~~'],
				[600, 'error', 'Found 1 error in src/components/UserCard.tsx:23'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[1200, 'info', 'Checking 32 files...'],
				[1800, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'vite build',
			lines: [
				[800, 'info', 'vite v5.2.0 building for production...'],
				[600, 'info', 'transforming...'],
				[3200, 'info', '✓ 214 modules transformed.'],
				[1800, 'info', 'rendering chunks...'],
				[
					1200,
					'info',
					'dist/assets/index-Bq3kX2m1.js   142.30 kB │ gzip: 46.10 kB',
				],
				[600, 'success', '✓ built in 8.21s'],
			],
			failChance: 0.15,
			failLines: [
				[2400, 'error', '✘ [ERROR] Could not resolve "~/utils/analytics"'],
				[400, 'error', ''],
				[400, 'error', '    src/pages/Dashboard.tsx:3:21:'],
				[400, 'error', "      3 │ import { track } from '~/utils/analytics'"],
				[400, 'error', '        ╵                      ~~~~~~~~~~~~~~~~~~~~'],
				[600, 'error', '1 error'],
			],
		},
	],

	backend: [
		{
			cmd: 'npm install',
			lines: [
				[1600, 'info', 'Resolving packages...'],
				[2000, 'info', 'Fetching 89 packages...'],
				[1400, 'info', 'Linking dependencies...'],
				[600, 'success', '✓ Done in 5.2s'],
			],
		},
		{
			cmd: 'tsc --noEmit',
			lines: [
				[2200, 'info', 'Checking 18 source files...'],
				[3800, 'success', '✓ No type errors found'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[1000, 'info', 'Checking 18 files...'],
				[1600, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'node --test src/**/*.test.ts',
			lines: [
				[1200, 'info', 'Running test suite...'],
				[2200, 'info', '  ✓ AuthService › login › accepts valid token (112ms)'],
				[1800, 'info', '  ✓ AuthService › login › rejects expired token (88ms)'],
				[2400, 'info', '  ✓ UserService › createUser › hashes password (218ms)'],
				[
					2000,
					'info',
					'  ✓ UserService › getUser › returns 404 for missing id (64ms)',
				],
			],
			failChance: 0.3,
			failLines: [
				[2400, 'error', '  ✗ AuthService › login › should reject invalid token'],
				[400, 'error', '    AssertionError: expected 401 to equal 200'],
				[400, 'error', '      - Expected: 200'],
				[400, 'error', '      + Received: 401'],
				[
					400,
					'error',
					'      at Object.<anonymous> (src/api/auth.test.ts:34:5)',
				],
				[600, 'error', 'Tests  1 failed (23 passed)'],
			],
		},
	],

	fullstack: [
		{
			cmd: 'npm install',
			lines: [
				[2000, 'info', 'Resolving packages...'],
				[3200, 'info', 'Fetching 231 packages...'],
				[2000, 'info', 'Linking dependencies...'],
				[800, 'success', '✓ Done in 8.1s'],
			],
		},
		{
			cmd: 'tsc --noEmit --project tsconfig.client.json',
			lines: [
				[2400, 'info', 'Checking 32 client source files...'],
				[3200, 'success', '✓ No type errors found'],
			],
		},
		{
			cmd: 'tsc --noEmit --project tsconfig.server.json',
			lines: [[2800, 'info', 'Checking 18 server source files...']],
			failChance: 0.2,
			failLines: [
				[
					2000,
					'error',
					'src/server/controllers/jobs/createJob.ts:12:5 - error TS2353',
				],
				[
					400,
					'error',
					"  Object literal may only specify known properties, and 'pipline'",
				],
				[400, 'error', "  does not exist in type 'CreateJobOptions'."],
				[400, 'error', '  12     pipline: body.pipeline,'],
				[400, 'error', '         ~~~~~~~'],
				[600, 'error', 'Found 1 error.'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[1400, 'info', 'Checking 50 files...'],
				[2000, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'vitest run',
			lines: [
				[1200, 'info', 'Running 31 tests across 6 files...'],
				[2800, 'info', '  ✓ src/server/jobs/store.test.ts (8 tests) 142ms'],
				[2400, 'info', '  ✓ src/server/jobs/runner.test.ts (6 tests) 138ms'],
				[
					2000,
					'info',
					'  ✓ src/client/components/LogViewer.test.ts (5 tests) 129ms',
				],
				[
					1800,
					'info',
					'  ✓ src/client/components/RunButton.test.ts (4 tests) 122ms',
				],
				[2200, 'info', '  ✓ src/server/controllers/jobs.test.ts (8 tests) 145ms'],
			],
			failChance: 0.2,
			failLines: [
				[2400, 'error', '  ✗ src/server/jobs/runner.test.ts (1 failed) 161ms'],
				[
					400,
					'error',
					'    FAIL › runner › runJob › should handle cancellation mid-step',
				],
				[
					400,
					'error',
					'      AssertionError: expected "running" to equal "cancelled"',
				],
				[400, 'error', '        at runJob.test.ts:52:22'],
				[600, 'error', 'Tests  1 failed (30 passed)'],
			],
		},
		{
			cmd: 'esbuild src/client/entry.tsx --bundle --outdir=public/assets',
			lines: [
				[1600, 'info', 'Bundling entry point...'],
				[2000, 'info', '  public/assets/entry.js   218.4kb'],
				[600, 'success', '✓ Done in 4.2s'],
			],
		},
	],
};

export async function runJob(id: string) {
	await jobStore.acquireSlot();

	jobStore.setStatus(id, 'running');

	const isCancelled = () => jobStore.get(id)?.status === 'cancelled';

	try {
		const job = jobStore.get(id);
		if (!job) return;

		const steps = PIPELINES[job.pipeline];

		for (const step of steps) {
			if (isCancelled()) return;

			await sleep(jitter(200));
			jobStore.log(id, `$ ${step.cmd}`, 'cmd');

			for (const [delay, level, text] of step.lines) {
				if (isCancelled()) return;
				await sleep(jitter(delay as number));
				jobStore.log(id, text, level as 'info' | 'success' | 'error');
			}

			if (
				step.failChance &&
				step.failLines &&
				Math.random() < step.failChance
			) {
				for (const [delay, level, text] of step.failLines) {
					if (isCancelled()) return;
					await sleep(jitter(delay as number));
					jobStore.log(id, text, level as 'info' | 'success' | 'error');
				}
				throw new Error(`step failed: ${step.cmd}`);
			}
		}

		if (isCancelled()) return;

		await sleep(jitter(250));
		jobStore.log(id, '✓ Pipeline complete', 'success');
		jobStore.setStatus(id, 'success');
	} catch (_err) {
		if (!isCancelled()) {
			jobStore.setStatus(id, 'failed');
		}
	} finally {
		jobStore.releaseSlot();
	}
}
