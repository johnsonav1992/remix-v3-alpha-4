import type { RequestContext } from 'remix/fetch-router';
import { runJob } from '../../jobs/runner.ts';
import { jobStore, type PipelineType } from '../../jobs/store.ts';

const VALID_PIPELINES: PipelineType[] = [
	'frontend',
	'backend',
	'fullstack',
	'lint',
];

export const createJob = async (req: RequestContext) => {
	let pipeline: PipelineType = 'frontend';

	try {
		const body = (await req.request.json()) as { pipeline?: string };
		if (
			body.pipeline &&
			(VALID_PIPELINES as string[]).includes(body.pipeline)
		) {
			pipeline = body.pipeline as PipelineType;
		}
	} catch {}

	const job = jobStore.create(pipeline);

	runJob(job.id);

	return new Response(JSON.stringify({ id: job.id }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
