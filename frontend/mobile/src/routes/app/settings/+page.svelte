<script lang="ts">
    import { goto } from "$app/navigation";
    import { dispatchCommand, fetchApi } from "$lib/networking";
    import { pairedSensor, sensor } from "$lib/store";



    const onResetup = () => {
        goto('/setup');
    }

    const onUnpair = async () => {
        if (!$sensor) return;

        const b = await dispatchCommand($sensor.serial, fetchApi('POST', '/interface/unpair', { json: false, uuid: $pairedSensor }));
        goto('/');
    }

</script>



<h1>Asetukset</h1>

<div class="plant">
    <p>Omat vihervahtini</p>
    <div class="device">
        <div class="left">
            <p class="small">Vihervahti</p>
            <h2 class="big colored">{$sensor?.serial}</h2>
        </div>
        <div class="right">
            <button onclick={onResetup}>Aseta uusi kasvi</button>
            <button onclick={onUnpair}>Yhdistä toiseen vihervahtiin</button>
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

    .plant h2 {
        font-size: 1.4rem;
        margin-bottom: 10px;
    }

    .device {
        padding: 5px;

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-evenly;

        width: 90%;
    }

    .device .right {
        width: 70%;
        min-height: 100px;
        margin-left: 10px;
        padding-left: 10px;

        border-left: solid 1px var(--border-main);

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    .device .big {
        font-size: 1.4rem;
        font-family: 'bold';
        margin: 0;
    }

    .right button {
        margin: 5px;
        padding: 5px;

        border-radius: 3px;

        width: 100%;
    }
</style>