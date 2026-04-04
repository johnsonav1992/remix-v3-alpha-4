import { renderToStream } from 'remix/component/server';
import { type Job, type JobStatus, jobStore } from '../../jobs/store.ts';

const STATUS_COLOR: Record<JobStatus, string> = {
	queued: '#888',
	running: '#60a5fa',
	success: '#4ade80',
	failed: '#f87171',
};

const STATUS_LABEL: Record<JobStatus, string> = {
	queued: '○  queued',
	running: '●  running',
	success: '✓  success',
	failed: '✗  failed',
};

function JobRow() {
	return ({ job, selected }: { job: Job; selected: boolean }) => {
		const elapsed =
			job.finishedAt && job.startedAt
				? `${((job.finishedAt - job.startedAt) / 1000).toFixed(1)}s`
				: job.startedAt
					? 'running…'
					: null;

		return (
			<a
				href={`/?job=${job.id}`}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0.5rem 0.75rem',
					borderRadius: '6px',
					textDecoration: 'none',
					background: selected ? 'rgba(255,255,255,0.06)' : 'transparent',
					border: selected ? '1px solid #333' : '1px solid transparent',
					gap: '0.75rem',
				}}
			>
				<span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}>
					#{job.id}
				</span>
				<span style={{ fontSize: '0.75rem', color: STATUS_COLOR[job.status], flex: 1 }}>
					{STATUS_LABEL[job.status]}
				</span>
				{elapsed && (
					<span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'monospace' }}>
						{elapsed}
					</span>
				)}
			</a>
		);
	};
}

export function frameJobs(req: { url: URL }) {
	const selectedId = req.url.searchParams.get('job');
	const all = jobStore.all();

	const stream = renderToStream(
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
			{all.length === 0 ? (
				<span style={{ fontSize: '0.8rem', color: '#555', padding: '0.5rem 0.75rem' }}>
					No builds yet
				</span>
			) : (
				all.map((job) => <JobRow job={job} selected={job.id === selectedId} />)
			)}
		</div>,
	);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
