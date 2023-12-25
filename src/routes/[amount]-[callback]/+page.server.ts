import { callback } from "$lib";
import type { PageServerLoad } from "./$types";
import bolt11 from "bolt11";

export const load: PageServerLoad = async ({ params, url }) => {
	const comment = url.searchParams.get('comment');
	const c = await callback(atob(params.callback), params.amount, comment);
	return { ...c, decoded: bolt11.decode(c.pr) }
};
