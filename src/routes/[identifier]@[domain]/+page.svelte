<script lang="ts">
	import { goto } from '$app/navigation';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let amount: string = '';
	let comment: string = '';

	const submit = () => {
		if (amount) {
			goto(`/${amount}-${btoa(data.callback)}?comment=${comment}`);
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
		<span>Sats</span>
		<input class="input" type="number" placeholder="123" bind:value={amount} />
	</label>

	{#if data.commentAllowed && data.commentAllowed > 0}
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
