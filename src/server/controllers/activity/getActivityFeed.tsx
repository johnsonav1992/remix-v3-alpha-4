import { renderToStream } from 'remix/component/server';

import { ActivityFeedView } from '../../components/ActivityFeedView.tsx';
import { jobStore } from '../../jobs/store.ts';

export function getActivityFeed() {
	const jobs = jobStore.all().slice(0, 10);

	const stream = renderToStream(<ActivityFeedView jobs={jobs} />);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
