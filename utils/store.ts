export interface Course {
	name: string;
	link: string;
	favorite: boolean;
}

export const store = {
	forwardEnabled: storage.defineItem<boolean>("local:fwdEnabled", {
		fallback: false,
	}),
	loginEnabled: storage.defineItem<boolean>("local:isEnabled", {
		fallback: false,
	}),
	courses: storage.defineItem<Course[]>("local:courses"), // TODO consider migration
};
