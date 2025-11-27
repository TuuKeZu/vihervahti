<script lang="ts">
    import { goto, onNavigate } from '$app/navigation';
    import { fetchApi } from '$lib/networking';
    import { clearPairedSensor, loading, pairedSensor, sensor } from '$lib/store';
    import { onMount } from 'svelte';
    import type { Sensor } from '../../schema';
    import { fade, fly } from 'svelte/transition';

    let path = $state(window.location.pathname);
    
    const { children } = $props();
    
    const paired = $pairedSensor;

    let refresh;
    
    $effect(() => {
        if ($sensor != null) return;
        loading.set(true);

        fetchApi<Sensor>('GET', '/interface/get', { json: true, uuid: paired })
        .then(_sensor => {
            sensor.set(_sensor);
            loading.set(false);

            if (!_sensor.params)
                goto('/setup');
        })
        .catch(err => {
            sensor.set(null);
            pairedSensor.set(null);
            goto('/');
        })

    });

    onNavigate(() => {
        path = window.location.pathname;
    });

    onMount(() => {
        loading.set(false);
    })


</script>


<main>
    <div class="content">
        <div class="header">
            
        </div>
        {#key refresh}
            <div class="master" in:fade>
                {#if !$sensor}

                {:else}
                    {@render children()}
                {/if}
            </div>
        {/key}
        <nav>
            <div class="inner">
                <div class="icon" onclick={() => goto('/app')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="/icons/{ path == '/app' ? 'OmatKasvit_valittu.svg' : 'OmatKasvit.svg' }" >
                    <p class="{path == '/app' ? 'selected' : ''}">Omat kasvit</p>
                </div>
                <div class="icon" onclick={() => goto('/app/history')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="/icons/{ path == '/app/history' ? 'Historia_valittu.svg' : 'Historia.svg' }" >
                    <p class="{path == '/app/history' ? 'selected' : ''}">Historia</p>
                </div>
                <div class="icon" onclick={() => goto('/app/settings')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="/icons/{ path == '/app/settings' ? 'Asetukset_valittu.svg' : 'Asetukset.svg' }" >
                    <p class="{path == '/app/settings' ? 'selected' : ''}">Asetukset</p>
                </div>
            </div>
        </nav>
    </div>
</main>

<style>
    .content {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: whitesmoke;
    }

    .header {
        position: absolute;
        width: 100%;
        height: 75px;
    }

    .master {
        position: absolute;
        top: 75px;
        width: 100%;
        height: calc(100% - 175px);

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    nav {
        position: absolute;
        width: 100%;
        height: 100px;

        bottom: 0;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    nav .inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;

        background-color: white;

        width: 90%;

        border-radius: 20px;
    }

    nav .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;

        cursor: pointer;

        transition: opacity .2s ease-in-out;
    }

    .icon img {
        height: 25px;
        width: 25px;
        margin: 3px;

        user-select: none;
    }

    .icon p {
        font-size: .9rem;
        user-select: none;
    }

    .icon p.selected {
        color: var(--blue);
    }

    .icon:hover {
        opacity: 0.7;
    }
</style>