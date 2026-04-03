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
					const isFrameRoute = url.startsWith("/frame/") || url.startsWith("/events/");

					if (!acceptsHtml && !isFrameRoute) {
						return next();
					}

					const attempt = async (retries = 5): Promise<void> => {
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
							if (retries > 0) {
								await new Promise((r) => setTimeout(r, 500));
								return attempt(retries - 1);
							}
							next();
						}
					};

					await attempt();
				});
			},
		},
	],
});
