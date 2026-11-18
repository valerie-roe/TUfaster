import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
	modules: ["@wxt-dev/module-vue", "@wxt-dev/i18n/module"],
	manifest: {
		permissions: ["storage", "system.cpu", "alarms"],
		default_locale: "en",
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
