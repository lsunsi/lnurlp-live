import z from 'zod';

export type Currency = z.infer<typeof Currency>;
const Currency = z.object({
	code: z.string(),
	name: z.string(),
	symbol: z.string(),
	decimals: z.number(),
	multiplier: z.number(),
	convertible: z
		.object({
			min: z.number(),
			max: z.number()
		})
		.optional()
});

type Entrypoint = z.infer<typeof Entrypoint>;

const EntrypointMetadata = z.tuple([z.string(), z.string()]).array();
const Entrypoint = z.object({
	tag: z.string(),
	metadata: z.string().transform((s) => EntrypointMetadata.parse(JSON.parse(s))),
	callback: z.string(),
	minSendable: z.number(),
	maxSendable: z.number(),
	commentAllowed: z.number().default(0),
	currencies: Currency.array().default([])
});

export const entrypoint = async (url: string): Promise<Entrypoint> =>
	fetch(url)
		.then((a) => a.json())
		.then(Entrypoint.parse);

type Callback = z.infer<typeof Callback>;

const Callback = z.object({
	pr: z.string(),
	converted: z.number().optional()
});

export const callback = async (
	url: string,
	amount: string,
	comment: string | null,
	convert: string | null
): Promise<Callback> => {
	const query = new URLSearchParams({ amount });

	if (comment) {
		query.append('comment', comment);
	}

	if (convert) {
		query.append('convert', convert);
	}

	return fetch(`${url}?${query}`)
		.then((a) => a.json())
		.then(Callback.parse);
};
