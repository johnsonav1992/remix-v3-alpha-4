import { run } from 'remix/component';

run({
	loadModule: async (moduleUrl, exportName) => {
		const mod = await import(moduleUrl);
		return mod[exportName];
	},
	resolveFrame: async (src, signal) => {
		const res = await fetch(src, { headers: { accept: 'text/html' }, signal });
		return res.body ?? (await res.text());
	},
});

export { default as ActivityPanel } from './components/ActivityPanel.tsx';
export { default as Counter } from './components/Counter.tsx';
export { default as LogViewer } from './components/LogViewer.tsx';
