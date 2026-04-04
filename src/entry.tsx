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

export { Counter } from './components/Counter.tsx';
export { ActivityPanel } from './components/ActivityPanel.tsx';
