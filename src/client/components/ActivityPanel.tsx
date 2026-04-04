import { addEventListeners, type Handle } from 'remix/component';
import { clientComponent } from '../clientComponent.ts';

const ActivityPanel = (handle: Handle) => {
	if (typeof EventSource !== 'undefined') {
		const source = new EventSource('/events/activity');
		addEventListeners(source, handle.signal, {
			message: () => handle.frames.get('job-list')?.reload(),
		});
	}

	return () => null;
};

export default clientComponent(ActivityPanel);
