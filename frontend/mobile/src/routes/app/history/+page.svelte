<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import { sensor } from "$lib/store";
    import { onMount } from "svelte";
    import InfoBox from '../../components/InfoBox.svelte';

    const x = $derived($sensor?.history.map(({ t }) => t));
    const y1 = $derived($sensor?.history.map(({ d }) => (d / 1700) * 100));
    const y2 = $derived($sensor?.history.map(({ tp }) => tp));


    onMount(() => {
        Chart.register(...registerables);

        const ctx = document.getElementById('chart');
        if (!ctx) return;

        new Chart(<any>ctx, {
            type: 'line',
            data: {
                labels: x,
                datasets: [
                    {
                        label: 'Kosteus',
                        data: y1,
                        fill: true
                    },
                    {
                        label: 'Lämpötila',
                        data: y2,
                        fill: false,
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        max: 100,
                        min: 0,
                        ticks: {
                            callback: (value) => `${value}%`
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 40,
                        ticks: {
                            callback: (value) => `${value} °C`
                        }
                    }
                }
            },
        });
    })
</script>


<h1>Kasteluhistoria</h1>

<div class="plant">
    <h2>{$sensor?.params?.plant.finnish}</h2>
    <p class="label blue">Kosteus</p>
    <canvas id="chart"></canvas>
    <p class="x">Aika</p>
</div>

<InfoBox>
    <p>Erilaiset kasvot viihtyvät erilaisilla kosteus-olosuhteissa! Lämpötila vaikuttaa kasvin kuivumiseen</p>
</InfoBox>


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

    .plant h2 {
        font-size: 1.3rem;
        margin: 0;

        width: 95%;
        font-family: 'bold';
    }

    .plant .label {
        width: 95%;
        font-family: 'bold';

        margin: 0;
        margin-bottom: 10px;

        font-size: 1rem;
    }

    .plant .x {
        font-weight: bold;
        font-family: 'bold';

        margin: 0;
        margin-top: -5px;

        font-size: 1rem;

        opacity: 0.5;
    }
</style>