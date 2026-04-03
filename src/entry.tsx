import { run } from "remix/component";

run({
	loadModule: async (moduleUrl, exportName) => {
		const mod = await import(/* @vite-ignore */ moduleUrl);
		return mod[exportName];
	},
	resolveFrame: async (src, signal) => {
		const res = await fetch(src, { signal });
		return res.body ?? (await res.text());
	},
});
