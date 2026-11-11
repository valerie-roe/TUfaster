import { sites } from "./sites";
import { collectMatches } from "@/utils/matches";

export default defineContentScript({
	matches: collectMatches(sites),

	async main(ctx) {
		const { isEnabled } = await browser.storage.local.get("isEnabled");
		if (!isEnabled) return false;

		const entry = match_site(sites);

		if (!entry) throw Errors.MATCH_FIND;
		const site = entry[1];

		// TODO handle logout

		const error = site.findError();

		if (error != undefined) {
			console.log("login error occured: ", error);
			return;
		}

		const platform = "platform" in site ? site.platform : undefined;
		site.login(await retrieveCredentials(platform));
	},
});
