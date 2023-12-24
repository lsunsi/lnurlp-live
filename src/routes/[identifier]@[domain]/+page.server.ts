import type { Actions, PageServerLoad } from "./$types";
import { callback, entrypoint } from "$lib";

export const load: PageServerLoad = async ({ params }) => {
	const e = await entrypoint(`https://${params.domain}/.well-known/lnurlp/${params.identifier}`)
	return { e };
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const url = data.get("callback")?.toString();
		const amount = data.get("amount")?.toString();

		if (!url || !amount) {
			return { success: false };
		}

		const c = await callback(url, +amount * 1000);

		return { success: true, pr: c.pr };
	}
} as Actions;
