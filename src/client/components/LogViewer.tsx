import { css, type Handle, on } from 'remix/component';
import type { LogLevel, LogLine } from '../../server/jobs/store.ts';
import { clientComponent } from '../clientComponent.ts';

const LEVEL_COLOR: Record<LogLevel, string> = {
	cmd: '#60a5fa',
	info: '#ccc',
	success: '#4ade80',
	error: '#f87171',
};

const LogViewer = (handle: Handle, jobId: string) => {
	const lines: LogLine[] = [];
	let done = false;
	let finalStatus: string | null = null;
	let cancelling = false;

	const cancel = async () => {
		if (cancelling || done) return;
		cancelling = true;
		handle.update();
		await fetch(`/jobs/${jobId}/cancel`, { method: 'POST' });
	};

	if (typeof EventSource !== 'undefined') {
		const source = new EventSource(`/jobs/${jobId}/stream`);

		source.onmessage = (e: MessageEvent) => {
			const data = JSON.parse(e.data) as LogLine & {
				done?: boolean;
				status?: string;
			};
			if (data.done) {
				done = true;
				finalStatus = data.status ?? null;
				source.close();
				handle.frames.get('job-list')?.reload();
				handle.frames.get(`job-${jobId}`)?.reload();
			} else {
				lines.push(data);
			}
			handle.update();
		};

		handle.signal.addEventListener('abort', () => source.close());
	}

	return () => (
		<div
			mix={[css({ display: 'flex', flexDirection: 'column', gap: '0.5rem' })]}
		>
			{!done && (
				<div mix={[css({ display: 'flex', justifyContent: 'flex-end' })]}>
					<button
						type="button"
						mix={[
							css({
								padding: '0.25rem 0.65rem',
								background: 'transparent',
								color: cancelling ? '#555' : '#666',
								border: '1px solid #2a2a2a',
								borderRadius: '4px',
								fontSize: '0.75rem',
								cursor: cancelling ? 'not-allowed' : 'pointer',
								':hover': cancelling
									? {}
									: { color: '#f87171', borderColor: '#f87171' },
							}),
							on('click', cancel),
						]}
					>
						{cancelling ? 'Cancelling…' : '✕ Cancel'}
					</button>
				</div>
			)}

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
							color: finalStatus === 'cancelled' ? '#555' : '#333',
							marginTop: '0.5rem',
							paddingTop: '0.5rem',
							borderTop: '1px solid #1a1a1a',
						}}
					>
						{finalStatus === 'cancelled'
							? '— cancelled —'
							: '— end of output —'}
					</span>
				)}
			</div>
		</div>
	);
};

export default clientComponent(LogViewer);
