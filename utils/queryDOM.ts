export function q<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode?: HTMLElement,
): T | undefined {
	const queryNode = parentNode ? parentNode : document;
	return queryNode.querySelector(query) ?? undefined;
}
