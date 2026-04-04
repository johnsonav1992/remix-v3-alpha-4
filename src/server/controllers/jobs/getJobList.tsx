import { renderToStream } from 'remix/component/server';
import type { RequestContext } from 'remix/fetch-router';

import { JobListView } from '../../components/JobListView.tsx';
import { jobStore } from '../../jobs/store.ts';

export const getJobList = (req: RequestContext) => {
	const selectedId = req.url.searchParams.get('job');
	const jobs = jobStore.all();

	const stream = renderToStream(
		<JobListView
			jobs={jobs}
			selectedId={selectedId}
		/>,
	);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
};
