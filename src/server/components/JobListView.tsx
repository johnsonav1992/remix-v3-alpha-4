import { type Job } from '../jobs/store.ts';
import { JobRow } from './JobRow.tsx';

export function JobListView() {
	return ({ jobs, selectedId }: { jobs: Job[]; selectedId: string | null }) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
			{jobs.length === 0 ? (
				<span
					style={{
						fontSize: '0.8rem',
						color: '#555',
						padding: '0.5rem 0.75rem',
					}}
				>
					No builds yet
				</span>
			) : (
				jobs.map((job) => (
					<JobRow
						job={job}
						selected={job.id === selectedId}
					/>
				))
			)}
		</div>
	);
}
