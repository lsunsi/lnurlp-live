import { callback } from "$lib";
import type { PageServerLoad } from "./$types";
import bolt11 from "bolt11";

export const load: PageServerLoad = async ({ params, url }) => {
	const comment = url.searchParams.get('comment');
	const convert = url.searchParams.get('convert');

	const name = url.searchParams.get('name');
	const symbol = url.searchParams.get('symbol');
	const decimals = url.searchParams.get('decimals');

	const c = await callback(atob(params.callback), params.amount, comment, convert);
	return { ...c, decoded: bolt11.decode(c.pr), name, symbol, decimals: decimals && +decimals }
};
