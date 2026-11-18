export function q<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode: HTMLElement = document.body,
): T | undefined {
	return parentNode.querySelector<T>(query) ?? undefined;
}

export function qMust<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode?: HTMLElement,
): T {
	const res = q<T>(query, parentNode);
	if (!res) throw Errors.DOM_FIND;
	return res;
}

export function qAll<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode: HTMLElement = document.body,
): Array<T> {
	return Array.from(parentNode.querySelectorAll(query));
}

export function observe(target: HTMLElement, cb: () => void) {
	const observer = new MutationObserver(cb);

	observer.observe(target, { subtree: true, childList: true });

	return observer;
}

/**
 * waits for the `cb` to become truthy, then returns it's return value
 */
// export function waitFor<T>(cb: () => T, timeout: number = 3000): Promise<T> {
// 	if (cb()) return Promise.resolve(cb());

// 	return new Promise((resolve, reject) => {
// 		const observer = new MutationObserver(() => {
// 			const res = cb();
// 			if (res) {
// 				observer.disconnect();
// 				resolve(res);
// 			}
// 		});
// 		observer.observe(document.body, { subtree: true, childList: true });

// 		setTimeout(() => {
// 			observer.disconnect();
// 			reject("wait timed out");
// 		}, timeout);
// 	});
// }

/**
 * Returns promise that resolves after `timeout`
 * @param timeout in ms
 * @returns
 */
export async function delay(timeout: number = 1000): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}

/**
 * Helper to click buttons like `<a href="javascript:;"/>` to avoid CSP Errors
 */
export function clickVoidLink(button: HTMLAnchorElement) {
	button.removeAttribute("href");
	button.click();
}
