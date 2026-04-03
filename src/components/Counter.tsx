import { clientEntry, css, on, type Handle } from "remix/component";

export const Counter = clientEntry(
	"/src/components/Counter.tsx#Counter",
	function Counter(handle: Handle) {
		let count = 0;

		const increment = () => {
			count++;
			handle.update();
		};

		const decrement = () => {
			count--;
			handle.update();
		};

		const reset = () => {
			count = 0;
			handle.update();
		};

		return () => (
			<div
				mix={[
					css({
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "1.5rem",
						padding: "2rem 3rem",
						background: "#1a1a1a",
						border: "1px solid #2a2a2a",
						borderRadius: "12px",
					}),
				]}
			>
				<span
					mix={[
						css({
							fontSize: "4rem",
							fontWeight: 700,
							fontVariantNumeric: "tabular-nums",
							color: count === 0 ? "#888" : count > 0 ? "#7ee8a2" : "#f87171",
							transition: "color 0.15s ease",
						}),
					]}
				>
					{count}
				</span>

				<div mix={[css({ display: "flex", gap: "0.75rem" })]}>
					<button
						mix={[
							css({
								padding: "0.5rem 1.25rem",
								background: "#2a2a2a",
								color: "#efefef",
								border: "1px solid #3a3a3a",
								borderRadius: "8px",
								fontSize: "1.25rem",
								cursor: "pointer",
								":hover": { background: "#333" },
							}),
							on("click", decrement),
						]}
					>
						−
					</button>

					<button
						mix={[
							css({
								padding: "0.5rem 1.25rem",
								background: "#2a2a2a",
								color: "#888",
								border: "1px solid #3a3a3a",
								borderRadius: "8px",
								fontSize: "0.875rem",
								cursor: "pointer",
								":hover": { background: "#333", color: "#efefef" },
							}),
							on("click", reset),
						]}
					>
						reset
					</button>

					<button
						mix={[
							css({
								padding: "0.5rem 1.25rem",
								background: "#2a2a2a",
								color: "#efefef",
								border: "1px solid #3a3a3a",
								borderRadius: "8px",
								fontSize: "1.25rem",
								cursor: "pointer",
								":hover": { background: "#333" },
							}),
							on("click", increment),
						]}
					>
						+
					</button>
				</div>
			</div>
		);
	},
);
