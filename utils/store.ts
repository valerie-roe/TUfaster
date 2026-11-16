export interface Course {
	name: string;
	link: string;
	favorite: boolean;
}

const def = storage.defineItem;
export const store = {
	forwardEnabled: def<boolean>("local:fwdEnabled", {
		fallback: false,
	}),
	loginEnabled: def<boolean>("local:isEnabled", {
		fallback: false,
	}),
	courses: def<Course[]>("local:courses"), // TODO consider migration
};
