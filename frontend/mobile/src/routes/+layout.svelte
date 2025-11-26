<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import { loading } from '$lib/store';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<div class="content">
	<div class="mobile {$loading ? 'loading' : ''}">
		{@render children()}
	</div>
</div>

<style>
	.content {
		position: absolute;
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;
	}

	.mobile {
		position: absolute;

		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		max-width: 400px;
		max-height: 800px;

		border: solid black;
	}

	.mobile.loading {
		filter: blur(3px);
	}
</style>
