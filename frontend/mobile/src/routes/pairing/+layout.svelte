<script lang="ts">
    import { fly } from 'svelte/transition';

    let { children } = $props();
</script>


<main>
    <div class="content">
        {@render children()}
    </div>
</main>

<style>
    main {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .content {
        width: 90%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>