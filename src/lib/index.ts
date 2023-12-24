import z from "zod";

type Entrypoint = z.infer<typeof Entrypoint>;
const Entrypoint = z.object({
	tag: z.string(),
	metadata: z.string(),
	callback: z.string(),
	minSendable: z.number(),
	maxSendable: z.number(),
	commentAllowed: z.number().nullable(),
});

export const entrypoint = async (url: string): Promise<Entrypoint> => fetch(url).then(a => a.json()).then(Entrypoint.parse);

type Callback = z.infer<typeof Callback>;
const Callback = z.object({
	pr: z.string()
});

export const callback = async (url: string, amount: number): Promise<Callback> => fetch(`${url}?${new URLSearchParams({
	amount: amount.toString()
})}`).then(a => a.json()).then(Callback.parse);
