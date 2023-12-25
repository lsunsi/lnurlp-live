import type { PageServerLoad } from "./$types";
import { entrypoint } from "$lib";

export const load: PageServerLoad = async ({ params }) => {
	const e = await entrypoint(`https://${params.domain}/.well-known/lnurlp/${params.identifier}`);

	const shortDescription = e.metadata.find(([k]) => k === "text/plain");
	const identifier = e.metadata.find(([k]) => k === "text/identifier");
	const image64 = e.metadata.find(([k]) => k === "image/png;base64" || k === "image/jpeg;base64");

	return {
		...e,
		shortDescription: shortDescription && shortDescription[1],
		identifier: identifier && identifier[1],
		image64,
	};
};
