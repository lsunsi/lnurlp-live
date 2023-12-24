<script lang="ts">
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;

	let amount: string = '';
</script>

<div class="mx-auto max-w-96">
	{#if form?.pr}
		<qr-code class="visible max-h-96 max-w-96" contents={`lightning:${form.pr}`} />
	{/if}

	<form method="POST">
		<input type="hidden" name="callback" value={data.e.callback} />

		<label class="label">
			<span>Sats</span>
			<input class="input" type="number" name="amount" placeholder="123" bind:value={amount} />
		</label>

		<button type="submit" class="variant-filled btn">Submit</button>
	</form>
</div>
