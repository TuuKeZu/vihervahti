<script lang="ts">
    import { goto } from "$app/navigation";
    import { fetchApi } from "$lib/networking";
    import { onMount } from "svelte";
    import type { AvailableSensor } from "../../schema";



    let available: AvailableSensor[] = $state([]); 
    let selected: AvailableSensor | null = $state(null);
    let loading: boolean = $state(true);

    onMount(async () => {
        const list = await fetchApi<AvailableSensor[]>('GET', '/interface/sensors', { json: true });
        available = list;
        loading = false;
    });

    const nav = () => {
        if (!selected) return;
        goto(`/pairing/${selected.uuid}`)
    }

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
{#if loading}
    <p>Loading...</p>
{:else}
    <li>
        {#each available as sensor}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <p onclick={() => selected = sensor} class="selectable {sensor == selected ? 'disabled' : ''}">#{sensor.serial}</p>
        {/each}
    </li>
{/if}

<style>
    .selected-device {
        display: flex;
        flex-direction: column;
        align-items: center;

        box-shadow: 0 0 15px var(--shadow-main);
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