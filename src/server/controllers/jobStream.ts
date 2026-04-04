import type { LogLine } from '../jobs/store.ts';
import { jobStore } from '../jobs/store.ts';

export function jobStream(req: { params: { id: string }; request: Request }) {
	const { id } = req.params;
	const job = jobStore.get(id);

	if (!job) return new Response('Not found', { status: 404 });

	const encoder = new TextEncoder();
	const send = (data: unknown) =>
		encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

	const stream = new ReadableStream({
		start(controller) {
			// Replay existing log lines
			for (const line of job.logs) {
				controller.enqueue(send(line));
			}

			// Already finished — close immediately
			if (job.status === 'success' || job.status === 'failed') {
				controller.enqueue(send({ done: true, status: job.status }));
				controller.close();
				return;
			}

			const onLog = (line: LogLine) => controller.enqueue(send(line));
			const onDone = (status: string) => {
				controller.enqueue(send({ done: true, status }));
				controller.close();
				cleanup();
			};

			const cleanup = () => {
				jobStore.off(`log:${id}`, onLog);
				jobStore.off(`done:${id}`, onDone);
			};

			jobStore.on(`log:${id}`, onLog);
			jobStore.on(`done:${id}`, onDone);

			req.request.signal.addEventListener('abort', () => {
				cleanup();
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
