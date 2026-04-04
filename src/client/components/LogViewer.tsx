import { css, type Handle } from 'remix/component';
import { clientComponent } from '../client.ts';
import type { LogLevel, LogLine } from '../../server/jobs/store.ts';

const LEVEL_COLOR: Record<LogLevel, string> = {
	cmd: '#60a5fa',
	info: '#ccc',
	success: '#4ade80',
	error: '#f87171',
};

const LogViewer = (handle: Handle, jobId: string) => {
	const lines: LogLine[] = [];
	let done = false;

	if (typeof EventSource !== 'undefined') {
		const source = new EventSource(`/jobs/${jobId}/stream`);

		source.onmessage = (e: MessageEvent) => {
			const data = JSON.parse(e.data) as LogLine & {
				done?: boolean;
				status?: string;
			};
			if (data.done) {
				done = true;
				source.close();
			} else {
				lines.push(data);
			}
			handle.update();
		};

		handle.signal.addEventListener('abort', () => source.close());
	}

	return () => (
		<div
			mix={[
				css({
					fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
					fontSize: '0.8125rem',
					lineHeight: '1.6',
					background: '#080808',
					border: '1px solid #222',
					borderRadius: '8px',
					padding: '1rem 1.25rem',
					minHeight: '300px',
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					gap: '0.1rem',
				}),
			]}
		>
			{lines.length === 0 && !done && (
				<span style={{ color: '#444' }}>Connecting…</span>
			)}
			{lines.map((line) => (
				<span
					style={{
						color: LEVEL_COLOR[line.level],
						whiteSpace: 'pre',
						paddingLeft: line.level === 'cmd' ? '0' : '1rem',
					}}
				>
					{line.text}
				</span>
			))}
			{done && (
				<span
					style={{
						color: '#333',
						marginTop: '0.5rem',
						paddingTop: '0.5rem',
						borderTop: '1px solid #1a1a1a',
					}}
				>
					— end of output —
				</span>
			)}
		</div>
	);
};

export default clientComponent(LogViewer);
