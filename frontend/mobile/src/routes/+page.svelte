<script lang="ts">
    import { goto } from "$app/navigation";
    import { loading } from "$lib/store";
    import { onMount } from "svelte";


    const nav = () => {
        goto('/pairing');
    }
</script>

<main>
    <div class="top">
        <div class="img"></div>
    </div>
    <div class="bottom">
        <div class="content">
            <h1>Tervetuloa <br><span class="colored">Vihervahtiin!</span></h1>
            <p>Kasvisi ymmärtäminen on muutaman napautuksen päässä</p>

            <button on:click={nav}>Ota Vihervahti käyttöön</button>
        </div>
    </div>
</main>

<style>
    main {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .top,
    .bottom {
        position: absolute;
        width: 100%;
        height: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .bottom {
        bottom: 0;
    }

    .img {
        height: calc(100% - 5px);
        width: calc(100% - 5px);

        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;

        background-image: url(/img/TervetuloaHero.png);
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
    }

    .content {
        height: calc(100% - 20px);
        width: calc(100% - 20px);

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content h1 {
        margin: 10px;
        width: 90%;
    }

    .content p {
        width: 90%;
    }

    .content button {
        font-size: 1.2rem;
        padding: 10px;
        margin: 10px;
        margin-top: 20px;
    }
</style>