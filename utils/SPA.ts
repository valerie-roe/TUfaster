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
	target: HTMLElement = document.body,
	timeout?: number,
): Promise<void> {
	return new Promise((resolve, reject) => {
		let timer: NodeJS.Timeout;
		if (timeout) {
			timer = setTimeout(() => {
				observer.disconnect();
				reject(Errors.TIMEOUT);
			}, timeout);
		}

		const observer = observe(target, () => {
			if (timeout) {
				clearTimeout(timer);
			}
			observer.disconnect();
			resolve();
		});
	});
}
