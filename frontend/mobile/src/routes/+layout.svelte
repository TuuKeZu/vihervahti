<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import { loading } from '$lib/store';
    import { onMount } from 'svelte';

	let { children } = $props();


	let _loading = $state(false);

	$effect(() => {
		if (!$loading) {
			_loading = false;
			return;
		}

		if ($loading) {
			setTimeout(() => {
				if (!$loading)
					return _loading = false;

				_loading = true;
			}, 500)
		}
	})

	onMount(() => {
        loading.set(false);
    })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<div class="content">
	{#if _loading}
		<span class="loader"></span>
	{/if}
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

		background-color: whitesmoke;
	}

	.mobile {
		position: absolute;

		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		max-width: 400px;
		max-height: 800px;

		background-color: whitesmoke;
	}

	.mobile.loading {
		filter: blur(3px);
	}
	
	/* */
	.loader {
		position: absolute;
		z-index: 3;
        width: 64px;
        height: 64px;
        position: relative;
        background-image:
          linear-gradient(var(--accent-lighter) 16px, transparent 0) ,
          linear-gradient(var(--accent-main) 16px, transparent 0) ,
          linear-gradient(var(--accent-main) 16px, transparent 0) ,
          linear-gradient(var(--accent-lighter) 16px, transparent 0);
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: left top , left bottom , right top , right bottom;
        animation: rotate 1s linear infinite;
      }
      @keyframes rotate {
        0% {
          width: 64px;
          height: 64px;
          transform: rotate(0deg)
        }
        50% {
          width: 30px;
          height: 30px;
          transform: rotate(180deg)
        }
        100% {
          width: 64px;
          height: 64px;
          transform: rotate(360deg)
        }
      }
</style>
