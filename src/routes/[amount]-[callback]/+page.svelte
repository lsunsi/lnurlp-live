<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const expiresAt = data.decoded.timeExpireDate && new Date(data.decoded.timeExpireDate * 1000);
	let expiresIn = expiresAt && Math.trunc((+expiresAt - +new Date()) / 1000);

	onMount(() => {
		const interval = setInterval(() => {
			expiresIn = expiresAt && Math.max(Math.trunc((+expiresAt - +new Date()) / 1000), 0);
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex place-content-center gap-x-2">
	<span class="variant-ghost badge">{data.decoded.satoshis} satoshis</span>
	{#if expiresIn && expiresIn > 0}
		<span class="variant-ghost badge">Expires in {expiresIn} seconds</span>
	{:else if expiresIn === 0}
		<span class="variant-filled-error badge">Expired</span>
	{/if}
</div>

<qr-code class="visible max-h-96 max-w-96" contents={`lightning:${data.pr}`} />
