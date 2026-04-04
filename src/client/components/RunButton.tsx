import { css, type Handle, navigate, on } from 'remix/component';

import { clientComponent } from '../clientComponent.ts';

const RunButton = (handle: Handle) => {
	let loading = false;

	const run = async () => {
		if (loading) return;

		loading = true;
		handle.update();

		const res = await fetch('/jobs', { method: 'POST' });
		const { id } = (await res.json()) as { id: string };

		await navigate(`/?job=${id}`);

		loading = false;
		handle.update();
	};

	return () => (
		<button
			type="button"
			mix={[
				css({
					padding: '0.3rem 0.75rem',
					background: loading ? '#111' : '#1a1a1a',
					color: loading ? '#555' : '#efefef',
					border: '1px solid #333',
					borderRadius: '6px',
					fontSize: '0.75rem',
					cursor: loading ? 'not-allowed' : 'pointer',
					':hover': loading ? {} : { background: '#222', borderColor: '#444' },
				}),
				on('click', run),
			]}
		>
			{loading ? 'Starting…' : '+ Run'}
		</button>
	);
};

export default clientComponent(RunButton);
