interface Course {
	name: string;
	link: string;
	favorite: boolean;
}

export default defineContentScript({
	matches: ["https://bildungsportal.sachsen.de/opal/auth/resource/*"],

	async main(ctx) {
		spaMain(ctx, scrapeCourses, partialPattern("resource/courses*"));
	},
});

async function scrapeCourses() {
	console.log("scraping");
	const contentPanel = qMust(".table-panel");

	const showAll = qMust<HTMLAnchorElement>(".pager-showall");
	const showAllText = showAll.innerText.trim().toLowerCase();
	if (showAllText == "show all" || showAllText == "alle anzeigen") {
		const pendingMutation = waitForMutation(contentPanel);
		clickVoidLink(showAll);
		await pendingMutation;
	}

	const container = qMust(".content-preview-container, tbody", contentPanel);

	const courses = container.matches("tbody") // TODO fix name scraping
		? parseTable(container)
		: parsePreviewList(container);

	if (courses.length === 0) return;
	// Sort them by name
	courses.sort((a, b) => a.name.localeCompare(b.name));

	const { courses: oldCourses } = await browser.storage.local.get("courses");
	console.log("old", oldCourses);
	console.log("new", courses);

	if (deepEqual(courses, oldCourses)) return;
	console.log("changed");
	await browser.storage.local.set({ courses: courses }); // TODO update storage schema

	notify(
		oldCourses
			? t("content.opal.coursesUpdated")
			: t("content.opal.coursesSaved"),
	);
}

function parseTable(tbody: HTMLElement): Array<Course> {
	const courses = [];

	const rows = qAll("tr", tbody);
	for (const row of rows) {
		const link = qMust<HTMLAnchorElement>("a", row);

		if (!link.href || !link.textContent) continue;
		if (
			link.textContent.trim().endsWith("[beendet]") ||
			link.textContent.trim().endsWith("[finished]")
		)
			continue;

		courses.push({
			link: link.href,
			name: link.textContent,
			favorite: qAll("icon-star-filled", row).length > 0 ? true : false,
		});
	}

	return courses;
}

function parsePreviewList(previewContainer: HTMLElement): Array<Course> {
	const courses: Course[] = [];

	const items = qAll(".content-preview", previewContainer);
	for (const item of items) {
		const link = qMust<HTMLAnchorElement>(".content-preview > a", item);
		const title = qMust(".content-preview-main .content-preview-title", item);

		if (!link.href || !title.textContent) continue;
		if (
			title.textContent.trim().endsWith("[beendet]") ||
			title.textContent.trim().endsWith("[finished]")
		)
			continue;

		courses.push({
			link: link.href,
			name: title.innerText.trim(),
			favorite: qAll("icon-star-filled", item).length > 0 ? true : false,
		});
	}

	return courses;
}
