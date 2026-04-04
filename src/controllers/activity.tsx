import { renderToStream } from 'remix/component/server';
import {
	ActivityFeed,
	type ActivityItem,
} from '../components/ActivityFeed.tsx';

const ACTIONS = [
	'pushed a commit',
	'opened a pull request',
	'merged a branch',
	'closed an issue',
	'left a review',
	'deployed to staging',
	'created a branch',
	'requested a review',
	'approved a PR',
	'added a comment',
];

const USERS = [
	'alex',
	'sam',
	'jordan',
	'taylor',
	'casey',
	'morgan',
	'riley',
	'drew',
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

export function activity() {
	const items: ActivityItem[] = Array.from({ length: 5 }, () => ({
		user: pick(USERS),
		action: pick(ACTIONS),
		mins: Math.floor(Math.random() * 59) + 1,
	}));

	const stream = renderToStream(<ActivityFeed items={items} />);

	return new Response(stream, {
		headers: { 'Content-Type': 'text/html' },
	});
}
