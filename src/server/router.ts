import { createRouter } from 'remix/fetch-router';
import { logger } from 'remix/logger-middleware';
import { staticFiles } from 'remix/static-middleware';

import { getActivityFeed } from './controllers/activity/getActivityFeed.tsx';
import { getActivityStream } from './controllers/activity/getActivityStream.ts';
import { home } from './controllers/home.tsx';
import { cancelJob } from './controllers/jobs/cancelJob.ts';
import { createJob } from './controllers/jobs/createJob.ts';
import { getJobDetail } from './controllers/jobs/getJobDetail.tsx';
import { getJobList } from './controllers/jobs/getJobList.tsx';
import { getJobStream } from './controllers/jobs/getJobStream.ts';
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

	router.get(routes.jobs.list, getJobList);
	router.post(routes.jobs.list, createJob);
	router.get(routes.jobs.detail, getJobDetail);
	router.get(routes.jobs.stream, getJobStream);
	router.post(routes.jobs.cancel, cancelJob);

	router.get(routes.activity.feed, getActivityFeed);
	router.get(routes.activity.stream, getActivityStream);

	return router;
}
