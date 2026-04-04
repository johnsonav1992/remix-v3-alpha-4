import { css, Frame, type Handle } from 'remix/component';

export function App(_handle: Handle, selectedJobId?: string) {
	return () => (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>ci — remix v3</title>
				<style innerHTML="*, *::before, *::after { box-sizing: border-box; } html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; background: #0a0a0a; color: #efefef; }" />
			</head>
			<body>
				<div
					mix={[
						css({
							display: 'grid',
							gridTemplateColumns: '260px 1fr',
							gridTemplateRows: '100vh',
							height: '100vh',
						}),
					]}
				>
					{/* Sidebar */}
					<aside
						mix={[
							css({
								borderRight: '1px solid #1e1e1e',
								display: 'flex',
								flexDirection: 'column',
								overflow: 'hidden',
							}),
						]}
					>
						<div
							mix={[
								css({
									padding: '1rem',
									borderBottom: '1px solid #1e1e1e',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: '0.75rem',
								}),
							]}
						>
							<span
								mix={[
									css({
										fontSize: '0.75rem',
										fontWeight: 600,
										color: '#555',
										textTransform: 'uppercase',
										letterSpacing: '0.1em',
									}),
								]}
							>
								Builds
							</span>
							<form
								method="post"
								action="/jobs"
							>
								<button
									type="submit"
									mix={[
										css({
											padding: '0.3rem 0.75rem',
											background: '#1a1a1a',
											color: '#efefef',
											border: '1px solid #333',
											borderRadius: '6px',
											fontSize: '0.75rem',
											cursor: 'pointer',
											':hover': { background: '#222', borderColor: '#444' },
										}),
									]}
								>
									+ Run
								</button>
							</form>
						</div>

						<div mix={[css({ flex: 1, overflowY: 'auto', padding: '0.5rem' })]}>
							<Frame
								name="job-list"
								src={`/frame/jobs${selectedJobId ? `?job=${selectedJobId}` : ''}`}
								fallback={
									<span
										mix={[
											css({
												fontSize: '0.8rem',
												color: '#444',
												padding: '0.5rem 0.75rem',
												display: 'block',
											}),
										]}
									>
										Loading…
									</span>
								}
							/>
						</div>
					</aside>

					{/* Main */}
					<main
						mix={[
							css({
								overflow: 'hidden',
								display: 'flex',
								flexDirection: 'column',
							}),
						]}
					>
						{selectedJobId ? (
							<div
								mix={[css({ flex: 1, overflow: 'auto', padding: '1.5rem' })]}
							>
								<Frame
									name={`job-${selectedJobId}`}
									src={`/frame/jobs/${selectedJobId}`}
									fallback={
										<span mix={[css({ fontSize: '0.8rem', color: '#444' })]}>
											Loading…
										</span>
									}
								/>
							</div>
						) : (
							<div
								mix={[
									css({
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}),
								]}
							>
								<span mix={[css({ fontSize: '0.875rem', color: '#333' })]}>
									Select a build or run a new one
								</span>
							</div>
						)}
					</main>
				</div>

				<script
					async
					type="module"
					src="/assets/entry.js"
				/>
			</body>
		</html>
	);
}
