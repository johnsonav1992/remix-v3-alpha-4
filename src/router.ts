import { createRouter } from 'remix/fetch-router';
import { logger } from 'remix/logger-middleware';
import { staticFiles } from 'remix/static-middleware';
import { activity } from './controllers/activity.tsx';
import { activityEvents } from './controllers/activityEvents.ts';
import { home } from './controllers/home.tsx';
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
	router.get(routes.activity, activity);
	router.get(routes.activityEvents, activityEvents);

	return router;
}
