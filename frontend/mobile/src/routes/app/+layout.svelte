<script lang="ts">
    import { goto } from '$app/navigation';
    import { fetchApi } from '$lib/networking';
    import { clearPairedSensor, pairedSensor, sensor } from '$lib/store';
    import type { Sensor } from '../../schema';


    const { children } = $props();

    const paired = $pairedSensor;

    $effect(() => {
        if ($sensor != null) return;

        fetchApi<Sensor>('GET', '/interface/get', { json: true, uuid: paired })
        .then(_sensor => {
            sensor.set(_sensor);
        })
        .catch(err => {
            sensor.set(null);
            pairedSensor.set(null);
            goto('/');
        })
    
    })

</script>


<main>
    <div class="content">
        {#if !$sensor}
            loading...
        {:else}
            {@render children()}
        {/if}
    </div>
</main>