import type { RequestContext } from 'remix/fetch-router';

import { jobStore } from '../../jobs/store.ts';

export function getActivityStream(req: RequestContext) {
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			const emit = () => {
				try {
					controller.enqueue(encoder.encode('data: {}\n\n'));
				} catch {}
			};

			jobStore.on('created', emit);
			jobStore.on('updated', emit);

			req.request.signal.addEventListener('abort', () => {
				jobStore.off('created', emit);
				jobStore.off('updated', emit);

				try {
					controller.close();
				} catch {}
			});
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	});
}
