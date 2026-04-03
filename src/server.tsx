import * as http from "node:http";
import { createRequestListener } from "remix/node-fetch-server";
import { createRouter } from "remix/fetch-router";
import { route } from "remix/fetch-router/routes";
import { logger } from "remix/logger-middleware";
import { renderToStream } from "remix/component/server";
import { App } from "./App.tsx";
import { ActivityFeed, type ActivityItem } from "./components/ActivityFeed.tsx";

const PORT = 3001;

const ACTIONS = [
	"pushed a commit",
	"opened a pull request",
	"merged a branch",
	"closed an issue",
	"left a review",
	"deployed to staging",
	"created a branch",
	"requested a review",
	"approved a PR",
	"added a comment",
];

const USERS = ["alex", "sam", "jordan", "taylor", "casey", "morgan", "riley", "drew"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const routes = route({
	index: "/",
	activity: "/frame/activity",
	activityEvents: "/events/activity",
});

const router = createRouter({
	middleware: [logger()],
});

router.get(routes.index, (req) => {
	const stream = renderToStream(<App />, {
		frameSrc: req.url.pathname,
		resolveFrame: async (src) => {
			const res = await fetch(`http://localhost:${PORT}${src}`);
			return res.body!;
		},
	});

	return new Response(stream, {
		headers: { "Content-Type": "text/html" },
	});
});

router.get(routes.activity, () => {
	const items: ActivityItem[] = Array.from({ length: 5 }, () => ({
		user: pick(USERS),
		action: pick(ACTIONS),
		mins: Math.floor(Math.random() * 59) + 1,
	}));

	const stream = renderToStream(<ActivityFeed items={items} />);

	return new Response(stream, {
		headers: { "Content-Type": "text/html" },
	});
});

router.get(routes.activityEvents, (req) => {
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			const interval = setInterval(() => {
				controller.enqueue(encoder.encode("data: {\"hello\": \"world\"}\n\n"));
			}, 4000);

			req.request.signal.addEventListener("abort", () => {
				clearInterval(interval);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
		},
	});
});

const server = http.createServer(createRequestListener((req) => router.fetch(req)));

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
