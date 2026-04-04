import { createRouter } from 'remix/fetch-router';
import { logger } from 'remix/logger-middleware';
import { staticFiles } from 'remix/static-middleware';
import { createJob } from './controllers/createJob.ts';
import { frameJob } from './controllers/frames/job.tsx';
import { frameJobs } from './controllers/frames/jobs.tsx';
import { home } from './controllers/home.tsx';
import { jobStream } from './controllers/jobStream.ts';
import { routes } from './routes.ts';

export function createAppRouter() {
	const router = createRouter({
		middleware: [
			logger(),
			staticFiles('./public', {
				cacheControl: 'no-store',
				etag: false,
				lastModified: false,
				index: false,
			}),
		],
	});

	router.get(routes.index, home);
	router.post('/jobs', createJob);
	router.get(routes.jobs.stream, jobStream);
	router.get(routes.frames.jobs, frameJobs);
	router.get(routes.frames.job, frameJob);

	return router;
}
