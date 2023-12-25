import { callback } from "$lib";
import type { PageServerLoad } from "./$types";
import bolt11 from "bolt11";

export const load: PageServerLoad = async ({ params }) => {
	const c = await callback(atob(params.callback), +params.amount * 1000);
	return { ...c, decoded: bolt11.decode(c.pr) }
};
