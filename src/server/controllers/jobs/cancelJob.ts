import type { RequestContext } from 'remix/fetch-router';

import { jobStore } from '../../jobs/store.ts';

export function cancelJob(req: RequestContext<{ id: string }>) {
	const cancelled = jobStore.cancel(req.params.id);

	if (!cancelled) return new Response('Not running', { status: 409 });

	return new Response(null, { status: 204 });
}
