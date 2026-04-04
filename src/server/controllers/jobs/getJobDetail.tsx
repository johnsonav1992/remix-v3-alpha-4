import { renderToStream } from 'remix/component/server';
import type { RequestContext } from 'remix/fetch-router';

import { JobDetailView } from '../../components/JobDetailView.tsx';
import { jobStore } from '../../jobs/store.ts';

export const getJobDetail = (req: RequestContext<{ id: string }>) => {
	const job = jobStore.get(req.params.id);

	if (!job) return new Response('Not found', { status: 404 });

	const stream = renderToStream(<JobDetailView job={job} />);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
};
