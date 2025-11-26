<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import { sensor } from "$lib/store";
    import { onMount } from "svelte";

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
                datasets: [{
                    label: 'Kosteus',
                    data: y1,
                    fill: true
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
                    }
                }
            },
        });
    })
</script>


<h1>Kasteluhistoria</h1>

<div class="plant">
    <h2>{$sensor?.params?.plant.finnish}</h2>
    <canvas id="chart"></canvas>
</div>

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
        font-size: 1.4rem;
        margin-bottom: 10px;
    }
</style>