import * as http from 'node:http';
import { createRequestListener } from 'remix/node-fetch-server';
import { createAppRouter } from './router.ts';

const PORT = Number(process.env.PORT ?? 3000);

const router = createAppRouter();

const server = http.createServer(
	createRequestListener((req) => router.fetch(req)),
);

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
