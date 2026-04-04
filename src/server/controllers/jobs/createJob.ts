import { runJob } from '../../jobs/runner.ts';
import { jobStore } from '../../jobs/store.ts';

export function createJob() {
	const job = jobStore.create();

	runJob(job.id);

	return new Response(JSON.stringify({ id: job.id }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
