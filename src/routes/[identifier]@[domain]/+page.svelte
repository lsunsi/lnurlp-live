<script lang="ts">
	import { goto } from '$app/navigation';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import type { Currency } from '$lib';

	export let data: PageServerData;

	let amount: string = '';
	let comment: string = '';

	let code: string = '';
	let convert: string = '';

	const convertibles = data.currencies.filter((c) => c.convertible);

	$: currency = data.currencies.find((c) => c.code == code);
	$: convertible = convertibles.find((c) => c.code == convert);

	$: minmax = calculateMinMax(currency, convertible);

	const calculateMinMax = (currency?: Currency, convertible?: Currency) => {
		// sats as sats
		if (!currency && !convertible) {
			return [data.minSendable / 1000, data.maxSendable / 1000];
		}

		// sats as currency
		if (!currency && convertible && convertible.convertible) {
			const min = (convertible.convertible.min * convertible.multiplier) / 1000;
			const max = (convertible.convertible.max * convertible.multiplier) / 1000;
			return [Math.ceil(min), Math.floor(max)];
		}

		// currency as sats
		if (currency && !convertible) {
			const scale = 10 ** currency.decimals;
			const min = data.minSendable / (currency.multiplier * scale);
			const max = data.maxSendable / (currency.multiplier * scale);
			const minRounded = Math.round((min + Number.EPSILON) * scale) / scale;
			const maxRounded = Math.round((max + Number.EPSILON) * scale) / scale;
			return [minRounded, maxRounded];
		}

		// currency as currency
		if (currency && convertible && convertible.convertible && convertible.code == currency.code) {
			const scale = 10 ** currency.decimals;
			const min = convertible.convertible.min / scale;
			const max = convertible.convertible.max / scale;
			const minRounded = Math.round((min + Number.EPSILON) * scale) / scale;
			const maxRounded = Math.round((max + Number.EPSILON) * scale) / scale;
			return [minRounded, maxRounded];
		}

		// currency1 as currency2
		if (currency && convertible && convertible.convertible && convertible.code != currency.code) {
			const scale = 10 ** currency.decimals;

			const min =
				(convertible.convertible.min * convertible.multiplier) / (scale * currency.multiplier);
			const max =
				(convertible.convertible.max * convertible.multiplier) / (scale * currency.multiplier);

			const minRounded = Math.round((min + Number.EPSILON) * scale) / scale;
			const maxRounded = Math.round((max + Number.EPSILON) * scale) / scale;

			return [minRounded, maxRounded];
		}

		return null;
	};

	const submit = () => {
		if (amount) {
			const query = new URLSearchParams();

			if (comment.length > 0) {
				query.append('comment', comment);
			}

			if (convertible) {
				query.append('convert', convertible.code);
				query.append('decimals', convertible.decimals.toString());
				query.append('symbol', convertible.symbol);
				query.append('name', convertible.name);
			}

			const a = currency
				? `${Math.trunc(+amount * 10 ** currency.decimals)}.${currency.code}`
				: (+amount * 1000).toString();

			goto(`/${a}-${btoa(data.callback)}?${query}`);
		}
	};
</script>

<svelte:head>
	<title>lnurlp live / how much?</title>
</svelte:head>

<div class="flex place-content-center pb-4">
	{#if data.image64}
		<Avatar src="data:{data.image64[0]}, {data.image64[1]}" width="w-32" rounded="rounded" />
	{/if}
</div>

<div class="flex place-content-center gap-x-2">
	{#if data.shortDescription}
		<span class="variant-ghost badge">{data.shortDescription}</span>
	{/if}

	{#if data.identifier}
		<span class="variant-ghost badge">{data.identifier}</span>
	{/if}
</div>

<form on:submit|preventDefault={submit} class="space-y-3 pt-4">
	<label class="label">
		<span>Amount</span>
		<div
			class="input-group input-group-divider"
			class:grid-cols-[auto_1fr_auto]={data.currencies.length > 0}
		>
			{#if data.currencies.length > 0}
				<select bind:value={code} class="select">
					<option value="">sats</option>
					{#each data.currencies as { code, symbol }}
						<option value={code}>{symbol}</option>
					{/each}
				</select>
			{/if}

			<input
				required
				class="input"
				type="number"
				placeholder="123"
				bind:value={amount}
				min={minmax?.[0]}
				max={minmax?.[1]}
				step={currency ? 1 / 10 ** currency.decimals : 1}
			/>
		</div>
	</label>

	{#if convertibles.length > 0}
		<label class="label">
			<span>Received as</span>

			<select bind:value={convert} class="select">
				<option value="">sats</option>
				{#each convertibles as { code, symbol, name, multiplier, decimals }}
					<option value={code}>
						{name}

						{#if currency && currency.code != code && +amount > 0}
							{@const sats = (+amount * 10 ** currency.decimals * currency.multiplier) / 1000}

							(~ {symbol}
							{(sats / (multiplier * 10 ** (decimals - 3))).toFixed(decimals)})
						{:else if !currency && +amount > 0}
							(~ {symbol} {(+amount / (multiplier * 10 ** (decimals - 3))).toFixed(decimals)})
						{:else}
							({symbol})
						{/if}
					</option>
				{/each}
			</select>
		</label>
	{/if}

	{#if data.commentAllowed > 0}
		<label class="label">
			<span>Comment</span>
			<input
				type="text"
				class="input"
				placeholder="hey there"
				maxlength={data.commentAllowed}
				bind:value={comment}
			/>
		</label>
	{/if}

	<div class="end-0 flex justify-end pt-4">
		<button type="submit" class="variant-filled btn">Submit</button>
	</div>
</form>
