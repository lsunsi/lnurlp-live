import z from "zod";

type Entrypoint = z.infer<typeof Entrypoint>;

const EntrypointMetadata = z.tuple([z.string(), z.string()]).array();
const Entrypoint = z.object({
	tag: z.string(),
	metadata: z.string().transform(s => EntrypointMetadata.parse(JSON.parse(s))),
	callback: z.string(),
	minSendable: z.number(),
	maxSendable: z.number(),
	commentAllowed: z.number().default(0),
	currencies: z.object({
		code: z.string(),
		name: z.string(),
		symbol: z.string(),
		decimals: z.number(),
		multiplier: z.number(),
		convertible: z.boolean().default(false)
	}).array().default([])
});

export const entrypoint = async (url: string): Promise<Entrypoint> => fetch(url).then(a => a.json()).then(Entrypoint.parse);

type Callback = z.infer<typeof Callback>;

const Callback = z.object({
	pr: z.string()
});

export const callback = async (url: string, amount: string, comment: string | null): Promise<Callback> => {
	const query = new URLSearchParams({ amount, });

	if (comment) {
		query.append('comment', comment);
	}

	return fetch(`${url}?${query}`).then(a => a.json()).then(Callback.parse);
}
