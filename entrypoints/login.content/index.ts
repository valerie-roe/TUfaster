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
			console.log("login error occured", error);
			return;
		}

		entry[1].login(await retrieveCredentials());
	},
});

// "https://bildungsportal.sachsen.de/opal/*",
// "https://cloudstore.zih.tu-dresden.de/*",
// "https://elearning.med.tu-dresden.de/*",
// "https://eportal.med.tu-dresden.de/*",
// "https://git.imld.de/*",
// "https://gitlab.hrz.tu-chemnitz.de/*",
// "https://gitlab.mn.tu-dresden.de/*",
// "https://matrix.tu-dresden.de/*",
// "https://msx.tu-dresden.de/*",
// "https://se-gitlab.inf.tu-dresden.de/*",
// "https://selma.tu-dresden.de/*",
// "https://*.slub-dresden.de/*",
// "https://tex.zih.tu-dresden.de/*",
// "https://videocampus.sachsen.de/*",
