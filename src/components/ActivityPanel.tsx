import { clientEntry, css, on, type Handle, type Renderable } from "remix/component";

export const ActivityPanel = clientEntry(
	"/src/components/ActivityPanel.tsx#ActivityPanel",
	function ActivityPanel(handle: Handle) {
		let reloading = false;

		const reload = async () => {
			if (reloading) return;
			reloading = true;
			handle.update();

			await handle.frames.get("activity-feed")?.reload();

			reloading = false;
			handle.update();
		};

		return (props: { children?: Renderable }) => (
			<section
				mix={[
					css({
						width: "100%",
						maxWidth: "480px",
						background: "#1a1a1a",
						border: "1px solid #2a2a2a",
						borderRadius: "12px",
						padding: "1.25rem 1.5rem",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
					}),
				]}
			>
				<div
					mix={[
						css({
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}),
					]}
				>
					<h2
						mix={[
							css({
								margin: 0,
								fontSize: "0.875rem",
								fontWeight: 600,
								color: "#888",
								textTransform: "uppercase",
								letterSpacing: "0.08em",
							}),
						]}
					>
						Activity Feed
					</h2>

					<button
						type="button"
						mix={[
							css({
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
								padding: "0.35rem 0.75rem",
								background: "transparent",
								color: reloading ? "#555" : "#888",
								border: "1px solid #2a2a2a",
								borderRadius: "6px",
								fontSize: "0.75rem",
								cursor: reloading ? "not-allowed" : "pointer",
								transition: "color 0.15s, border-color 0.15s",
								":hover": reloading ? {} : { color: "#efefef", borderColor: "#3a3a3a" },
							}),
							on("click", reload),
						]}
					>
						{reloading ? "Refreshing..." : "↺ Refresh"}
					</button>
				</div>

				{props.children}
			</section>
		);
	},
);
