import { callback } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => callback(atob(params.callback), +params.amount * 1000);
