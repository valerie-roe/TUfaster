import equal from "fast-deep-equal";

export const deepEqual = equal;

export function stringifyEqual<T>(a: T, b: T): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}
