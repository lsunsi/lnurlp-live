<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { invalidateAll } from '$app/navigation';

	export let data: PageServerData;

	const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

	$: expiresAt = data.decoded.timeExpireDate && new Date(data.decoded.timeExpireDate * 1000);
	let expiresIn = expiresAt && Math.trunc((+expiresAt - +new Date()) / 1000);

	onMount(() => {
		const interval = setInterval(() => {
			expiresIn = expiresAt && Math.max(Math.trunc((+expiresAt - +new Date()) / 1000), 0);
		}, 1000);

		return () => clearInterval(interval);
	});

	const format = (n: number, digits: number): string =>
		new Intl.NumberFormat(undefined, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		}).format(n);
</script>

<svelte:head>
	<title>lnurlp live / here you go</title>
	<script src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"></script>
</svelte:head>

<div class="flex place-content-center gap-x-2">
	<span class="variant-ghost badge">{data.decoded.satoshis} satoshis</span>

	{#if data.converted && data.decimals && data.symbol && data.name && data.decoded.millisatoshis}
		<span class="variant-ghost badge" title={data.name}>
			{data.symbol}
			{format(data.converted.amount / 10 ** data.decimals, data.decimals)}
		</span>
		<span class="variant-ghost badge" title={data.name}>
			{format(
				Math.round((data.converted.fee / +data.decoded.millisatoshis) * 10000) / 100,
				data.decimals
			)}% fee
		</span>
		<span class="variant-ghost badge" title={data.name}>
			{format(((1 / data.converted.multiplier) * 1e11) / 10 ** data.decimals, data.decimals)}
			{data.symbol}/฿
		</span>
	{/if}

	{#if expiresIn && expiresIn > 0}
		<span class="variant-ghost badge">Expires in {expiresIn} seconds</span>
	{:else if expiresIn === 0}
		<span
			class="variant-filled-error badge cursor-pointer"
			on:click={() => invalidateAll()}
			role="none"
		>
			Expired
		</span>
	{/if}
</div>

<qr-code class="visible max-h-96 max-w-96 dark:invert" contents={`lightning:${data.pr}`} />
