import { runJob } from '../jobs/runner.ts';
import { jobStore } from '../jobs/store.ts';

export function createJob() {
	const job = jobStore.create();
	runJob(job.id); // fire and forget
	return new Response(null, {
		status: 303,
		headers: { Location: `/?job=${job.id}` },
	});
}
