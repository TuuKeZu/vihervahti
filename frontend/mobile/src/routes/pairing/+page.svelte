<script lang="ts">
    import { goto } from "$app/navigation";
    import { fetchApi } from "$lib/networking";
    import { onDestroy, onMount } from "svelte";
    import { Smile, type AvailableSensor, type SmileStatus } from "../../schema";
    import { loading } from "$lib/store";

    let available: AvailableSensor[] = $state([]); 
    let selected: AvailableSensor | null = $state(null);
    let _loading: boolean = $state(true);

    const update = async () => {
        const list = await fetchApi<AvailableSensor[]>('GET', `/interface/sensors?t=${(new Date()).getTime()}`, { json: true });
        available = list;
    }

    onMount(async () => {
        const list = await fetchApi<AvailableSensor[]>('GET', '/interface/sensors', { json: true });
        available = list;
        _loading = false;
    });

    const nav = () => {
        if (!selected) return;
        goto(`/pairing/${selected.uuid}`)
    }

    $effect(() => {
        loading.set(_loading);
        _loading;
    });

    let clear: number;
    onMount(() => {
        clear = setInterval(update, 2000);
    });

    onDestroy(() => {
        clearInterval(clear);
    });

</script>


<h1>Valitse laite</h1>
<div class="selected-device">
    <p class="small">Vihervahti</p>
    <div class="device {!selected ? 'disabled' : ''}">
        <p>{selected?.serial ?? 'valitse'}</p>
        <button onclick={nav} class="arrow">{">"}</button>
    </div>
</div>
<p class="small">Etsitään lähellä olevia vihervahteja...</p>
{#if _loading}
    
{:else}
    <li>
        {#each available as sensor}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <p onclick={() => selected = sensor} class="selectable {sensor == selected ? 'disabled' : ''}">#{sensor.serial}</p>
        {:else}
            <p>Ei vihervahteja lähettyvillä</p>
        {/each}
    </li>
{/if}

<style>
    .selected-device {
        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: white;

        border-radius: 10px;

        margin: 10px;

        width: 250px;
        padding: 5px;
    }

    .selected-device .small {
        width: 95%;
    }


    .device {
        width: 90%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>