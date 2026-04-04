import { css, type Handle, navigate, on, ref } from 'remix/component';

import { clientComponent } from '../clientComponent.ts';

type PipelineType = 'frontend' | 'backend' | 'fullstack' | 'lint';

const PIPELINES: { value: PipelineType; label: string }[] = [
	{ value: 'frontend', label: 'Frontend' },
	{ value: 'backend', label: 'Backend' },
	{ value: 'fullstack', label: 'Full Stack' },
	{ value: 'lint', label: 'Lint' },
];

const SESSION_KEY = 'lastPipeline';

const RunButton = (handle: Handle) => {
	let loading = false;
	let selectEl: HTMLSelectElement | null = null;

	const saved =
		typeof sessionStorage !== 'undefined'
			? (sessionStorage.getItem(SESSION_KEY) as PipelineType | null)
			: null;

	const defaultPipeline: PipelineType =
		saved && PIPELINES.some((p) => p.value === saved) ? saved : 'frontend';

	const run = async () => {
		if (loading) return;

		loading = true;
		handle.update();

		const pipeline = (selectEl?.value ?? defaultPipeline) as PipelineType;

		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem(SESSION_KEY, pipeline);
		}

		const res = await fetch('/jobs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pipeline }),
		});

		const { id } = (await res.json()) as { id: string };

		await navigate(`/?job=${id}`);

		loading = false;
		handle.update();
	};

	return () => (
		<div mix={[css({ display: 'flex', gap: '0.4rem' })]}>
			<select
				mix={[
					css({
						padding: '0.3rem 0.5rem',
						background: '#111',
						color: loading ? '#444' : '#888',
						border: '1px solid #2a2a2a',
						borderRadius: '6px',
						fontSize: '0.7rem',
						cursor: loading ? 'not-allowed' : 'pointer',
						outline: 'none',
					}),
					ref((el) => {
						selectEl = el as HTMLSelectElement;
					}),
				]}
				disabled={loading}
			>
				{PIPELINES.map(({ value, label }) => (
					<option
						value={value}
						selected={value === defaultPipeline}
					>
						{label}
					</option>
				))}
			</select>

			<button
				type="button"
				mix={[
					css({
						padding: '0.3rem 0.65rem',
						background: loading ? '#111' : '#1a1a1a',
						color: loading ? '#444' : '#efefef',
						border: '1px solid #333',
						borderRadius: '6px',
						fontSize: '0.75rem',
						cursor: loading ? 'not-allowed' : 'pointer',
						':hover': loading
							? {}
							: { background: '#222', borderColor: '#444' },
					}),
					on('click', run),
				]}
				disabled={loading}
			>
				{loading ? 'Starting…' : '+ Run'}
			</button>
		</div>
	);
};

export default clientComponent(RunButton);
