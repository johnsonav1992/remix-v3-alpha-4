import type { Job, JobStatus } from '../jobs/store.ts';

const STATUS_ICON: Record<JobStatus, string> = {
	queued: '○',
	running: '●',
	success: '✓',
	failed: '✗',
	cancelled: '⊘',
};

const STATUS_COLOR: Record<JobStatus, string> = {
	queued: '#555',
	running: '#60a5fa',
	success: '#4ade80',
	failed: '#f87171',
	cancelled: '#555',
};

const TIME_FMT = new Intl.DateTimeFormat('en', { timeStyle: 'short' });

export const ActivityFeedView = () => {
	return ({ jobs }: { jobs: Job[] }) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
			{jobs.length === 0 ? (
				<span style={{ fontSize: '0.75rem', color: '#444' }}>
					No activity yet
				</span>
			) : (
				jobs.map((job) => (
					<a
						href={`/?job=${job.id}`}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							padding: '0.25rem 0.5rem',
							borderRadius: '4px',
							textDecoration: 'none',
						}}
					>
						<span
							style={{
								color: STATUS_COLOR[job.status],
								fontSize: '0.7rem',
								width: '0.8rem',
							}}
						>
							{STATUS_ICON[job.status]}
						</span>
						<span
							style={{
								fontFamily: 'monospace',
								fontSize: '0.7rem',
								color: '#555',
								flex: 1,
							}}
						>
							#{job.id}
						</span>
						<span
							style={{ fontSize: '0.7rem', color: STATUS_COLOR[job.status] }}
						>
							{job.status}
						</span>
						<span
							style={{
								fontSize: '0.65rem',
								color: '#3a3a3a',
								fontFamily: 'monospace',
							}}
						>
							{TIME_FMT.format(new Date(job.createdAt))}
						</span>
					</a>
				))
			)}
		</div>
	);
};
