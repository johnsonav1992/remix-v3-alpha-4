import type { Handle } from "remix/component";
import { Counter } from "./components/Counter.tsx";
import { css } from "remix/component";

export function App(_handle: Handle) {
	return () => (
		<div
			mix={[
				css({
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					gap: "2rem",
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

			<p
				mix={[
					css({
						margin: 0,
						color: "#888",
						fontSize: "1rem",
					}),
				]}
			>
				Built on web standards. No React.
			</p>

			<Counter />
		</div>
	);
}
