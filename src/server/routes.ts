import { route } from 'remix/fetch-router/routes';

export const routes = route({
	index: '/',
	jobs: {
		stream: '/jobs/:id/stream',
	},
	frames: {
		jobs: '/frame/jobs',
		job: '/frame/jobs/:id',
	},
});
