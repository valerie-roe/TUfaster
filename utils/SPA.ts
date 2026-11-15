import type { ContentScriptContext } from "#imports";
import type { URLPattern } from "./matches";

/** Runs `main` on initial load and subsequent SPA navigations matching `pattern`. */
export function spaMain(
	ctx: ContentScriptContext,
	main: () => unknown,
	pattern: URLPattern,
) {
	const run = () => {
		if (matches(pattern)) main();
	};

	run();
	ctx.addEventListener(window, "wxt:locationchange", run);
}

/** Resolves on the next DOM mutation under `target`, or rejects with `Errors.TIMEOUT`*/
export function waitForMutation(
	target: Node = document.body,
	timeout: number = 3000,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			observer.disconnect();
			reject(Errors.TIMEOUT);
		}, timeout);

		const observer = new MutationObserver(() => {
			clearTimeout(timer);
			observer.disconnect();
			resolve();
		});

		observer.observe(target, { subtree: true, childList: true });
	});
}
