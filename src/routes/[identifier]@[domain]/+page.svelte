<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let amount: string = '';

	const submit = () => {
		if (amount) {
			goto(`/${amount}-${btoa(data.callback)}`);
		}
	};
</script>

<form on:submit|preventDefault={submit}>
	<input type="hidden" name="callback" value={data.callback} />

	<label class="label">
		<span>Sats</span>
		<input class="input" type="number" name="amount" placeholder="123" bind:value={amount} />
	</label>

	<button type="submit" class="variant-filled btn">Submit</button>
</form>
