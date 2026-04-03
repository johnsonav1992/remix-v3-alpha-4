import { Frame, css, type Handle } from "remix/component";
import { Counter } from "./components/Counter.tsx";
import { ActivityPanel } from "./components/ActivityPanel.tsx";

const IS_DEV = (process.env.NODE_ENV ?? "development") !== "production";

// Server-only — renders the full HTML document via renderToStream
export function App(_handle: Handle) {
	return () => (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>remix v3 — alpha.4</title>
				<style innerHTML="*, *::before, *::after { box-sizing: border-box; } html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; background: #0f0f0f; color: #efefef; }" />
				{IS_DEV && <script type="module" src="/@vite/client" />}
			</head>
			<body>
				<div
					mix={[
						css({
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							minHeight: "100vh",
							gap: "2.5rem",
							padding: "2rem",
						}),
					]}
				>
					<h1
						mix={[
							css({
								margin: 0,
								fontSize: "2.5rem",
								fontWeight: 700,
								letterSpacing: "-0.02em",
								color: "#fff",
							}),
						]}
					>
						remix v3 — alpha.4
					</h1>

					<Counter />

					<ActivityPanel>
						<Frame
							name="activity-feed"
							src="/frame/activity"
							fallback={
								<p
									mix={[
										css({
											margin: 0,
											color: "#555",
											fontSize: "0.875rem",
											padding: "1rem 0",
										}),
									]}
								>
									Loading activity...
								</p>
							}
						/>
					</ActivityPanel>
				</div>

				<script
					type="module"
					src="/src/entry.tsx"
				/>
			</body>
		</html>
	);
}
