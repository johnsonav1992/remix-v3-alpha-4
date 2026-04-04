import { run } from 'remix/component';

run({
	loadModule: async (moduleUrl, exportName) => {
		const mod = await import(moduleUrl);
		return mod[exportName];
	},
	resolveFrame: async (src, signal) => {
		const res = await fetch(src, { signal });
		return res.body ?? (await res.text());
	},
});

export { default as Counter } from './components/Counter.tsx';
export { default as ActivityPanel } from './components/ActivityPanel.tsx';
