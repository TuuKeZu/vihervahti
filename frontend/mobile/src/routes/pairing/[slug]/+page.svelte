<script lang="ts">
    import { goto } from '$app/navigation';
    import { dispatchCommand, fetchApi } from '$lib/networking.js';
    import { sensor, setPairedSensor } from '$lib/store.js';
    import SvelteOtp from '@k4ung/svelte-otp';
    import { json } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import type { Sensor } from '../../../schema.js';



    const { data } = $props();
    const { promise } = data;

    let uuid: string | null = $state(null);
    let code = $state('');

    const pair = async () => {
        if (code.length != 5 || !uuid) return;

        await dispatchCommand(uuid, fetchApi('POST', '/interface/pair', { json: false, body: { code, uuid } }));
        setPairedSensor(uuid);
        
        setTimeout(redirctApp, 500);
    }

    const redirctApp = () => {
        fetchApi<Sensor>('GET', '/interface/get', { json: true, uuid })
        .then(_sensor => {
            sensor.set(_sensor);
            goto('/app');
        })
    }

    $effect(() => {
        promise
        .then(_uuid => {
            uuid = _uuid;
        })
        .catch(_ => {
            goto('/app');
        })
    })

</script>


{#if !uuid}
    <p>Loading</p>
{:else}
    <h1>Yhdistä laitteeseen</h1>
    <p>{uuid}</p>
    <div class="otp">
        <SvelteOtp
            numOfInputs={5}
            bind:value={code}
        />

        <button onclick={pair} class="{ code.length != 5 ? 'disabled' : ''}">Yhdistä</button>
    </div>
{/if}

<style>
    .otp {
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .otp button {
        padding: 10px;
        margin: 10px;
    }
    
</style>