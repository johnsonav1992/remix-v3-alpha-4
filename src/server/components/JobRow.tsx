import type { Job, JobStatus } from '../jobs/store.ts';

const STATUS_COLOR: Record<JobStatus, string> = {
	queued: '#888',
	running: '#60a5fa',
	success: '#4ade80',
	failed: '#f87171',
	cancelled: '#555',
};

const STATUS_LABEL: Record<JobStatus, string> = {
	queued: '○  queued',
	running: '●  running',
	success: '✓  success',
	failed: '✗  failed',
	cancelled: '⊘  cancelled',
};

export const JobRow = () => {
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
				<span
					style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}
				>
					#{job.id}
				</span>
				<span
					style={{
						fontSize: '0.75rem',
						color: STATUS_COLOR[job.status],
						flex: 1,
					}}
				>
					{STATUS_LABEL[job.status]}
				</span>
				{elapsed && (
					<span
						style={{
							fontSize: '0.75rem',
							color: '#555',
							fontFamily: 'monospace',
						}}
					>
						{elapsed}
					</span>
				)}
			</a>
		);
	};
};
