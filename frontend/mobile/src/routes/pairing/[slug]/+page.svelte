<script lang="ts">
    import { goto } from '$app/navigation';
    import { dispatchCommand, fetchApi } from '$lib/networking.js';
    import { loading, sensor, setPairedSensor } from '$lib/store.js';
    import SvelteOtp from '@k4ung/svelte-otp';
    import { json } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import type { Sensor } from '../../../schema.js';



    const { data } = $props();
    const { promise } = data;

    let uuid: string | null = $state(null);
    let code = $state('');
    let error = $state('');

    const pair = async () => {
        if (code.length != 5 || !uuid) return;
        error = '';

        await dispatchCommand(uuid, fetchApi('POST', '/interface/pair', { json: false, body: { code, uuid } }))
        .catch(err => {
            console.error(err);
            error = err;
            code = '';
        })
        setPairedSensor(uuid);
        redirctApp();
    }

    const redirctApp = () => {
        fetchApi<Sensor>('GET', '/interface/get', { json: true, uuid })
        .then(_sensor => {
            sensor.set(_sensor);

            if (!_sensor.params)
                return goto('/setup');

            goto('/setup');
        })
    }

    $effect(() => {
        loading.set(true);
        promise
        .then(_uuid => {
            uuid = _uuid;
            loading.set(false);
        })
        .catch(_ => {
            goto('/app');
        })
    })

</script>


{#if !uuid}
    
{:else}
    <h1>Yhdistä laitteeseen</h1>
    <p>{uuid}</p>
    <div class="otp">
        <SvelteOtp
            numOfInputs={5}
            bind:value={code}
        />

        <button onclick={pair} class="{ code.length != 5 ? 'disabled' : ''}">Yhdistä</button>
        <p class="error">{error}</p>
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
        margin: 20px;
    }

    .error {
        margin: 10px;
        text-align: center;

        font-size: 1.2rem;
    }
    
</style>