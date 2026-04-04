import { route } from 'remix/fetch-router/routes';

export const routes = route({
	index: '/',

	jobs: {
		list: '/jobs',
		detail: '/jobs/:id',
		stream: '/jobs/:id/stream',
		cancel: '/jobs/:id/cancel',
	},

	activity: {
		feed: '/activity',
		stream: '/events/activity',
	},
});
