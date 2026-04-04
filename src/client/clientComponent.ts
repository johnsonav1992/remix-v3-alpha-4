import {
	clientEntry,
	type Handle,
	type RemixNode,
	type SerializableProps,
	type SerializableValue,
} from 'remix/component';

export const clientComponent = <
	context = Record<string, never>,
	setup extends SerializableValue = undefined,
	props extends SerializableProps = SerializableProps,
>(
	component: (
		handle: Handle<context>,
		setup: setup,
	) => (props: props) => RemixNode,
) => {
	return clientEntry<context, setup, props>('/assets/entry.js', component);
};
