<script lang="ts">
    import { pairedSensor, sensor } from '../../lib/store';
</script>


<h1>Omat kasvit</h1>


<div class="plant">
    <img class="smile" alt="Smile" />
    <h1>{$sensor?.params.plant.finnish}</h1>
    <div class="status-fields">
        <div class="status">
            <p class="title">Kosteus</p>
            <div class="rows">
                <!-- svelte-ignore a11y_missing_attribute -->
                <img />
                <p class="value">80%</p>
            </div>
        </div>

        <div class="status">
            <p class="title">Seuraava kastelu</p>
            <div class="rows">
                <!-- svelte-ignore a11y_missing_attribute -->
                <img />
                <p class="value">7 pv</p>

                <!-- svelte-ignore a11y_missing_attribute -->
                <img />
                <p class="value">1 dl</p>
            </div>
        </div>
    </div>
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

    .smile {
        width: calc(100% - 20px);
        padding: 10px;
        aspect-ratio: 3/1;

        border-radius: 10px;

        background-color: var(--accent-main);
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

        background-color: whitesmoke;

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
</style>