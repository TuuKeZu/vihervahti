<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { pairedSensor, sensor } from '../../lib/store';
    import { Smile, type SmileStatus } from '../../schema';
    import { onDestroy, onMount } from 'svelte';
    import { fetchApi } from '$lib/networking';

    const update = async () => {
        const status = await fetchApi<SmileStatus | null>('GET', '/interface/status', { uuid: $pairedSensor, json: true });
        if (!status) return;
        
        sensor.update(sensor => {
            if (!sensor) return null;

            return {
                ...sensor,
                latestStatus: status
            }
        })
    }

    let clear: number;
    onMount(() => {
        clear = setInterval(update, 2000);
    });

    onDestroy(() => {
        clearInterval(clear);
    });
</script>


<h1>Omat kasvit</h1>

{#each [1] as _}
    <div class="plant" transition:fade>
        <div class="smile {$sensor?.latestStatus?.smile ?? Smile.Happy}" ></div>
        <h1>{$sensor?.params?.plant.finnish}</h1>
        <div class="status-fields">
            <div class="status">
                <p class="title blue">Kosteus</p>
                <div class="rows">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="icons/Kosteus.svg" />
                    <p class="value blue">{(($sensor?.latestStatus?.percentage ?? 0) * 100).toFixed(0)}%</p>
                </div>
            </div>

            <div class="status">
                <p class="title yellow">Seuraava kastelu</p>
                <div class="rows">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="icons/SeuraavaKastelu.svg" />
                    <p class="value">{$sensor?.latestStatus?.days} pv</p>

                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src="icons/SeuraavanKastelunMaara.svg" />
                    <p class="value bold">{$sensor?.latestStatus?.amount} dl</p>
                </div>
            </div>
        </div>
    </div>
{/each}


<style>
    h1 {
        font-size: 1.4rem;
        margin: 10px;
    }

    .plant {
        width: 75%;

        padding: 10px;

        background-color: white;

        border-radius: 20px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .smile {
        width: calc(100% - 20px);
        padding: 10px;
        aspect-ratio: 3/1;

        border-radius: 10px;

        background-size: 80% 80%;
        background-position: center center;
        background-repeat: no-repeat;
    }

    .smile.SAD {
        background-image: url(/icons/HymyHuono.svg);
        background-color: var(--red-light);
    }

    .smile.NEUTRAL {
        background-image: url(/icons/HymyHeikko.svg);
        background-color: var(--blue-light);
    }

    .smile.HAPPY {
        background-image: url(/icons/HymyHyvä.svg);
        background-color: var(--accent-lighter);
    }

    .plant h1 {
        width: 100%;
        padding-bottom: 10px;
        margin-bottom: 5px;

        border-bottom: solid 1px var(--border-main);
    }

    .status-fields {
        width: 100%;
        height: auto;
        
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .status {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        padding: 3px;
    }

    .status img {
        width: 20px;
        height: 20px;
        margin: 5px;
    }

    .status .rows {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .bold {
        font-weight: bold;
    }
</style>