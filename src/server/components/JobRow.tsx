import type { Job, JobStatus, PipelineType } from '../jobs/store.ts';

const STATUS_COLOR: Record<JobStatus, string> = {
	queued: '#555',
	running: '#60a5fa',
	success: '#4ade80',
	failed: '#f87171',
	cancelled: '#444',
};

const STATUS_LABEL: Record<JobStatus, string> = {
	queued: '○  queued',
	running: '●  running',
	success: '✓  success',
	failed: '✗  failed',
	cancelled: '⊘  cancelled',
};

const PIPELINE_COLOR: Record<PipelineType, string> = {
	frontend: '#818cf8',
	backend: '#a78bfa',
	fullstack: '#34d399',
	lint: '#fbbf24',
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
					padding: '0.5rem 0.75rem',
					borderRadius: '6px',
					textDecoration: 'none',
					background: selected ? 'rgba(255,255,255,0.06)' : 'transparent',
					border: selected ? '1px solid #333' : '1px solid transparent',
					gap: '0.5rem',
				}}
			>
				<span
					style={{
						fontSize: '0.6rem',
						fontWeight: 600,
						color: PIPELINE_COLOR[job.pipeline],
						textTransform: 'uppercase',
						letterSpacing: '0.05em',
						width: '3.5rem',
						flexShrink: 0,
					}}
				>
					{job.pipeline}
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
							fontSize: '0.7rem',
							color: '#444',
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
