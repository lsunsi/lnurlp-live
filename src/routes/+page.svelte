<script lang="ts">
	import { goto } from '$app/navigation';

	let domain: string = '';
	let identifier: string = '';

	const submit = async () => {
		if (domain && identifier) {
			await goto(`/${identifier}@${domain}`);
		}
	};
</script>

<svelte:head>
	<title>lnurlp live / who? where?</title>
</svelte:head>

<form class="pt-4" on:submit|preventDefault={submit}>
	<label class="label">
		<span>Domain</span>
		<input class="input" type="text" placeholder="bipa.app" bind:value={domain} />
	</label>

	<label class="label">
		<span>Identifier</span>
		<input class="input" type="text" placeholder="lsunsi" bind:value={identifier} />
	</label>

	<div class="end-0 flex justify-end pt-4">
		<button type="submit" class="variant-filled btn">Submit</button>
	</div>
</form>
