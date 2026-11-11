export function q<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode?: HTMLElement,
): T | undefined {
	const queryNode = parentNode ? parentNode : document;
	return queryNode.querySelector(query) ?? undefined;
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

export async function delay(timeout: number = 1000): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}
