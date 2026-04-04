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
				[120, 'info', 'Checking 24 files...'],
				[80, 'info', 'Applying safe fixes...'],
				[200, 'success', '✓ No remaining issues'],
			],
			failChance: 0.35,
			failLines: [
				[
					100,
					'error',
					'src/utils/format.ts:8:7 lint/correctness/noUnusedVariables',
				],
				[40, 'error', '  ✖ This variable is unused.'],
				[40, 'error', '  8 │ const locale = new Intl.NumberFormat("en-US")'],
				[40, 'error', '    │       ^^^^^^'],
				[80, 'error', 'Found 1 error.'],
			],
		},
	],

	frontend: [
		{
			cmd: 'npm install',
			lines: [
				[300, 'info', 'Resolving packages...'],
				[480, 'info', 'Fetching 142 packages...'],
				[580, 'info', 'Linking dependencies...'],
				[180, 'success', '✓ Done in 1.6s'],
			],
		},
		{
			cmd: 'tsc --noEmit',
			lines: [[340, 'info', 'Checking 32 source files...']],
			failChance: 0.25,
			failLines: [
				[200, 'error', 'src/components/UserCard.tsx:23:9 - error TS2322'],
				[
					40,
					'error',
					"  Type 'string | null' is not assignable to type 'string'.",
				],
				[40, 'error', '  23     <UserCard name={user.name} />'],
				[40, 'error', '                        ~~~~~~~~~'],
				[80, 'error', 'Found 1 error in src/components/UserCard.tsx:23'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[160, 'info', 'Checking 32 files...'],
				[280, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'vite build',
			lines: [
				[200, 'info', 'vite v5.2.0 building for production...'],
				[120, 'info', 'transforming...'],
				[600, 'info', '✓ 214 modules transformed.'],
				[300, 'info', 'rendering chunks...'],
				[
					180,
					'info',
					'dist/assets/index-Bq3kX2m1.js   142.30 kB │ gzip: 46.10 kB',
				],
				[100, 'success', '✓ built in 1.51s'],
			],
			failChance: 0.15,
			failLines: [
				[300, 'error', '✘ [ERROR] Could not resolve "~/utils/analytics"'],
				[40, 'error', ''],
				[40, 'error', '    src/pages/Dashboard.tsx:3:21:'],
				[40, 'error', "      3 │ import { track } from '~/utils/analytics'"],
				[40, 'error', '        ╵                      ~~~~~~~~~~~~~~~~~~~~'],
				[80, 'error', '1 error'],
			],
		},
	],

	backend: [
		{
			cmd: 'npm install',
			lines: [
				[280, 'info', 'Resolving packages...'],
				[420, 'info', 'Fetching 89 packages...'],
				[500, 'info', 'Linking dependencies...'],
				[160, 'success', '✓ Done in 1.2s'],
			],
		},
		{
			cmd: 'tsc --noEmit',
			lines: [
				[300, 'info', 'Checking 18 source files...'],
				[500, 'success', '✓ No type errors found'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[140, 'info', 'Checking 18 files...'],
				[220, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'node --test src/**/*.test.ts',
			lines: [
				[200, 'info', 'Running test suite...'],
				[300, 'info', '  ✓ AuthService › login › accepts valid token (12ms)'],
				[280, 'info', '  ✓ AuthService › login › rejects expired token (8ms)'],
				[320, 'info', '  ✓ UserService › createUser › hashes password (18ms)'],
				[
					260,
					'info',
					'  ✓ UserService › getUser › returns 404 for missing id (6ms)',
				],
			],
			failChance: 0.3,
			failLines: [
				[300, 'error', '  ✗ AuthService › login › should reject invalid token'],
				[40, 'error', '    AssertionError: expected 401 to equal 200'],
				[40, 'error', '      - Expected: 200'],
				[40, 'error', '      + Received: 401'],
				[
					40,
					'error',
					'      at Object.<anonymous> (src/api/auth.test.ts:34:5)',
				],
				[80, 'error', 'Tests  1 failed (23 passed)'],
			],
		},
	],

	fullstack: [
		{
			cmd: 'npm install',
			lines: [
				[320, 'info', 'Resolving packages...'],
				[500, 'info', 'Fetching 231 packages...'],
				[680, 'info', 'Linking dependencies...'],
				[200, 'success', '✓ Done in 2.1s'],
			],
		},
		{
			cmd: 'tsc --noEmit --project tsconfig.client.json',
			lines: [
				[280, 'info', 'Checking 32 client source files...'],
				[460, 'success', '✓ No type errors found'],
			],
		},
		{
			cmd: 'tsc --noEmit --project tsconfig.server.json',
			lines: [[220, 'info', 'Checking 18 server source files...']],
			failChance: 0.2,
			failLines: [
				[
					240,
					'error',
					'src/server/controllers/jobs/createJob.ts:12:5 - error TS2353',
				],
				[
					40,
					'error',
					"  Object literal may only specify known properties, and 'pipline'",
				],
				[40, 'error', "  does not exist in type 'CreateJobOptions'."],
				[40, 'error', '  12     pipline: body.pipeline,'],
				[40, 'error', '         ~~~~~~~'],
				[80, 'error', 'Found 1 error.'],
			],
		},
		{
			cmd: 'biome check .',
			lines: [
				[180, 'info', 'Checking 50 files...'],
				[320, 'success', '✓ No lint errors'],
			],
		},
		{
			cmd: 'vitest run',
			lines: [
				[200, 'info', 'Running 31 tests across 6 files...'],
				[400, 'info', '  ✓ src/server/jobs/store.test.ts (8 tests) 42ms'],
				[350, 'info', '  ✓ src/server/jobs/runner.test.ts (6 tests) 38ms'],
				[
					300,
					'info',
					'  ✓ src/client/components/LogViewer.test.ts (5 tests) 29ms',
				],
				[
					250,
					'info',
					'  ✓ src/client/components/RunButton.test.ts (4 tests) 22ms',
				],
				[280, 'info', '  ✓ src/server/controllers/jobs.test.ts (8 tests) 45ms'],
			],
			failChance: 0.2,
			failLines: [
				[300, 'error', '  ✗ src/server/jobs/runner.test.ts (1 failed) 61ms'],
				[
					40,
					'error',
					'    FAIL › runner › runJob › should handle cancellation mid-step',
				],
				[
					40,
					'error',
					'      AssertionError: expected "running" to equal "cancelled"',
				],
				[40, 'error', '        at runJob.test.ts:52:22'],
				[80, 'error', 'Tests  1 failed (30 passed)'],
			],
		},
		{
			cmd: 'esbuild src/client/entry.tsx --bundle --outdir=public/assets',
			lines: [
				[280, 'info', 'Bundling entry point...'],
				[350, 'info', '  public/assets/entry.js   218.4kb'],
				[120, 'success', '✓ Done in 18ms'],
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
