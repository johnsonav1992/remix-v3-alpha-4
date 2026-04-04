import { css, type Handle } from 'remix/component';

export type ActivityItem = {
	user: string;
	action: string;
	mins: number;
};

export function ActivityFeed(_handle: Handle) {
	return (props: { items: ActivityItem[] }) => (
		<ul mix={[css({ listStyle: 'none', margin: 0, padding: 0 })]}>
			{props.items.map((item) => (
				<li
					mix={[
						css({
							display: 'flex',
							alignItems: 'center',
							gap: '0.75rem',
							padding: '0.75rem 0',
							borderBottom: '1px solid #2a2a2a',
							fontSize: '0.875rem',
							color: '#ccc',
						}),
					]}
				>
					<span
						mix={[
							css({
								width: '32px',
								height: '32px',
								borderRadius: '50%',
								background: '#2a2a2a',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '0.75rem',
								color: '#888',
								flexShrink: 0,
							}),
						]}
					>
						{item.user[0]!.toUpperCase()}
					</span>
					<span>
						<strong mix={[css({ color: '#efefef' })]}>{item.user}</strong>{' '}
						{item.action}
						<span mix={[css({ color: '#555', marginLeft: '0.5rem' })]}>
							{item.mins}m ago
						</span>
					</span>
				</li>
			))}
			<p
				mix={[
					css({
						margin: '0.75rem 0 0',
						fontSize: '0.75rem',
						color: '#555',
						textAlign: 'right',
					}),
				]}
			>
				Fetched at {new Date().toLocaleTimeString()}
			</p>
		</ul>
	);
}
