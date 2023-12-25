<script lang="ts">
	import { goto } from '$app/navigation';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let amount: string = '';
	let comment: string = '';
	let code: string = '';

	$: currency = data.currencies.find((c) => c.code == code);

	const submit = () => {
		if (amount) {
			const a = currency
				? `${Math.trunc(+amount * 10 ** currency.decimals)}.${currency.code}`
				: (+amount * 1000).toString();

			goto(`/${a}-${btoa(data.callback)}?comment=${comment}`);
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

<form on:submit|preventDefault={submit} class="pt-4">
	<input type="hidden" name="callback" value={data.callback} />

	<label class="label">
		<span>Amount</span>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			{#if currency}
				<div class="input-group-shim">{currency.symbol}</div>
			{/if}
			<input
				class="input"
				type="number"
				placeholder="123"
				bind:value={amount}
				min={data.minSendable / 1000}
				max={data.maxSendable / 1000}
			/>
			<select bind:value={code}>
				<option value="">sats</option>
				{#each data.currencies as { code, name }}
					<option value={code}>{name}</option>
				{/each}
			</select>
		</div>
	</label>

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
