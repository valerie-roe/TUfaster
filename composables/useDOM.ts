export function useQ<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode: HTMLElement = document.body,
) {
	const elem = ref(q<T>(query, parentNode));
	observe(parentNode, () => {
		elem.value = q<T>(query, parentNode);
	});

	return elem;
}

export function useQAll<T extends HTMLElement = HTMLElement>(
	query: string,
	parentNode: HTMLElement = document.body,
) {
	const elem = ref(qAll<T>(query, parentNode));
	observe(parentNode, () => {
		elem.value = qAll<T>(query, parentNode);
	});

	return elem;
}
