import { route } from 'remix/fetch-router/routes';

export const routes = route({
	index: '/',
	activity: '/frame/activity',
	activityEvents: '/events/activity',
});
