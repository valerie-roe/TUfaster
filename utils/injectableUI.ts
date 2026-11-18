import type { Component, ContentScriptContext } from "#imports";

import "@/assets/tailwind.css";

type injectOptions = {
	append?: ContentScriptAppendMode;
	position?: "inline" | "modal" | "overlay";
};

// export async function injectShadowApp(
// 	ctx: ContentScriptContext,
// 	app: Component,
// 	anchor: string,
// 	options: injectOptions,
// ) {
// 	const ui = await createShadowRootUi(ctx, {
// 		name: "tufast-injected",
// 		position: options.position ?? "inline",
// 		anchor,
// 		append: options.append ?? "after",
// 		onMount: (uiContainer) => {
// 			const vueApp = createApp(app);
// 			vueApp.mount(uiContainer);
// 			console.log("cerated");
// 			return vueApp;
// 		},
// 		onRemove: (app) => {
// 			app?.unmount();
// 		},
// 	});

// 	q(anchor) ? ui.mount() : ui.autoMount();

// 	return ui;
// }

export async function injectApp(
	ctx: ContentScriptContext,
	app: Component,
	anchor: string,
	options: injectOptions,
) {
	const ui = await createIntegratedUi(ctx, {
		anchor,
		position: options.position ?? "inline",
		append: options.append ?? "after",
		onMount: (uiContainer) => {
			const vueApp = createApp(app);
			vueApp.provide("uiContainer", uiContainer);
			vueApp.mount(uiContainer);
			console.log("cerated");
			return vueApp;
		},
		onRemove: (app) => {
			app?.unmount();
		},
	});

	q(anchor) ? ui.mount() : ui.autoMount();

	return ui;
}
