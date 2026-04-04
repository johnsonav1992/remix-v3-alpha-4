export function activityEvents(req: { request: Request }) {
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			const interval = setInterval(() => {
				controller.enqueue(encoder.encode('data: {"hello": "world"}\n\n'));
			}, 4000);

			req.request.signal.addEventListener('abort', () => {
				clearInterval(interval);
				controller.close();
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
