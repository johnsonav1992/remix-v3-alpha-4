import { defineConfig } from "vite";
import { Readable } from "node:stream";

export default defineConfig({
	appType: "custom",
	plugins: [
		{
			name: "ssr-proxy",
			configureServer(server) {
				server.middlewares.use(async (req, res, next) => {
					const url = req.url ?? "/";
					const acceptsHtml = req.headers.accept?.includes("text/html");
					const isFrameRoute = url.startsWith("/frame/");

					if (!acceptsHtml && !isFrameRoute) {
						return next();
					}

					try {
						const upstream = await fetch(`http://localhost:3001${url}`, {
							method: req.method,
							headers: { ...req.headers, host: "localhost:3001" } as HeadersInit,
						});

						res.statusCode = upstream.status;
						upstream.headers.forEach((value, key) => {
							if (key !== "transfer-encoding" && key !== "connection") {
								res.setHeader(key, value);
							}
						});

						if (upstream.body) {
							Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0]).pipe(res);
						} else {
							res.end();
						}
					} catch {
						// Server not ready yet, let Vite handle it
						next();
					}
				});
			},
		},
	],
});
