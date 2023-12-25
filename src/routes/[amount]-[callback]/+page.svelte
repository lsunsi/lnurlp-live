<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<qr-code class="visible max-h-96 max-w-96" contents={`lightning:${data.pr}`} />
