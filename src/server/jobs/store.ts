import { EventEmitter } from 'node:events';

export type LogLevel = 'cmd' | 'info' | 'success' | 'error';

export type LogLine = {
	id: number;
	text: string;
	level: LogLevel;
};

export type JobStatus =
	| 'queued'
	| 'running'
	| 'success'
	| 'failed'
	| 'cancelled';

export type Job = {
	id: string;
	createdAt: number;
	startedAt?: number;
	finishedAt?: number;
	status: JobStatus;
	logs: LogLine[];
};

class JobStore extends EventEmitter {
	private jobs = new Map<string, Job>();
	private seq = 0;

	create(): Job {
		const id = Math.random().toString(36).slice(2, 9);
		const job: Job = { id, createdAt: Date.now(), status: 'queued', logs: [] };
		this.jobs.set(id, job);
		this.emit('created');
		return job;
	}

	get(id: string) {
		return this.jobs.get(id);
	}

	all() {
		return [...this.jobs.values()].sort((a, b) => b.createdAt - a.createdAt);
	}

	log(id: string, text: string, level: LogLevel = 'info') {
		const job = this.jobs.get(id);
		if (!job) return;
		const line: LogLine = { id: ++this.seq, text, level };
		job.logs.push(line);
		this.emit(`log:${id}`, line);
	}

	setStatus(id: string, status: JobStatus) {
		const job = this.jobs.get(id);
		if (!job) return;

		job.status = status;

		if (status === 'running') job.startedAt = Date.now();
		if (status === 'success' || status === 'failed' || status === 'cancelled')
			job.finishedAt = Date.now();

		this.emit(`done:${id}`, status);
		this.emit('updated');
	}

	cancel(id: string): boolean {
		const job = this.jobs.get(id);
		if (!job || job.status !== 'running') return false;

		this.setStatus(id, 'cancelled');
		return true;
	}
}

export const jobStore = new JobStore();
