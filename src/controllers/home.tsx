import { renderToStream } from 'remix/component/server';
import { App } from '../App.tsx';

export function home(req: { url: URL }) {
	const stream = renderToStream(<App />, {
		frameSrc: req.url.pathname,
		resolveFrame: async (src) => {
			const port = process.env.PORT ?? '3000';
			const res = await fetch(`http://localhost:${port}${src}`, {
				headers: { accept: 'text/html' },
			});
			return res.body!;
		},
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'text/html' },
	});
}
