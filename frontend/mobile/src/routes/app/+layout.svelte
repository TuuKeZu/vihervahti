<script lang="ts">
    import { goto } from '$app/navigation';
    import { fetchApi } from '$lib/networking';
    import { clearPairedSensor, loading, pairedSensor, sensor } from '$lib/store';
    import type { Sensor } from '../../schema';


    const { children } = $props();

    const paired = $pairedSensor;

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
    
    })

</script>


<main>
    <div class="content">
        <div class="header">
            
        </div>
        <div class="master">
            {#if !$sensor}

            {:else}
                {@render children()}
            {/if}
        </div>
        <nav>
            <div class="inner">
                <div class="icon" onclick={() => goto('/app')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img >
                    <p>Omat kasvit</p>
                </div>
                <div class="icon" onclick={() => goto('/app/history')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img >
                    <p>Historia</p>
                </div>
                <div class="icon" onclick={() => goto('/app/settings')}>
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img >
                    <p>Asetukset</p>
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
        box-shadow: 0 0 10px 10px var(--shadow-light);

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
    }

    .icon img {
        height: 30px;
        width: 30px;
        margin: 3px;
    }

    .icon p {
        font-size: .9rem;
    }
</style>