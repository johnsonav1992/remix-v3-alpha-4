import { renderToStream } from 'remix/component/server';
import LogViewer from '../../../client/components/LogViewer.tsx';
import { type JobStatus, jobStore } from '../../jobs/store.ts';

const STATUS_COLOR: Record<JobStatus, string> = {
	queued: '#888',
	running: '#60a5fa',
	success: '#4ade80',
	failed: '#f87171',
};

const STATUS_LABEL: Record<JobStatus, string> = {
	queued: '○  Queued',
	running: '●  Running',
	success: '✓  Succeeded',
	failed: '✗  Failed',
};

export function frameJob(req: { params: { id: string } }) {
	const job = jobStore.get(req.params.id);

	if (!job) return new Response('Not found', { status: 404 });

	const stream = renderToStream(
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				height: '100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingBottom: '0.75rem',
					borderBottom: '1px solid #2a2a2a',
				}}
			>
				<span
					style={{
						fontFamily: 'monospace',
						fontSize: '0.85rem',
						color: '#666',
					}}
				>
					build #{job.id}
				</span>
				<span style={{ fontSize: '0.8rem', color: STATUS_COLOR[job.status] }}>
					{STATUS_LABEL[job.status]}
				</span>
			</div>
			<LogViewer setup={job.id} />
		</div>,
	);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
