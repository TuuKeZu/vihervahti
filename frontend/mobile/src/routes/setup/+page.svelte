<script lang="ts">
    import { goto } from "$app/navigation";
    import { fetchApi } from "$lib/networking";
    import { onMount } from "svelte";
    import { PotSize } from "../../schema";

    const SIZES = {
        [PotSize.Small]: ['Pieni', '(alle litra)'],
        [PotSize.Medium]: ['Keskikokoinen', '(1-5 litraa)'],
        [PotSize.Big]: ['Suuriä', '(yli 5 litraa)'],
    }

    enum State {
        SelectPlant,
        SelectRuukku // :D
    }

    type Entry = { id: string, name: string, latin: string };

    let status: State = $state(State.SelectRuukku);
    let listing: Entry[] = $state([]);


    const selectPlant = (id: string) => {
        status = State.SelectRuukku;
    }

    onMount(() => {
        fetchApi<Entry[]>('GET', '/plants/list', { json: true })
        .then(_list => {
            listing = _list;
        })
        .catch(err => {
            console.error(err);
        })
    })

</script>


<main>
    <div class="header">
        <div class="status {status == State.SelectPlant ? 'selected' : ''}">
            <p>1</p>
        </div>
        <div class="status {status == State.SelectRuukku ? 'selected' : ''}">
            <p>2</p>
        </div>
    </div>
    <div class="content">
        {#key (status)}
            {#if status == State.SelectPlant}
                <h1>Valitse kasvi</h1>
        
                
                <div class="listing plants">
                    <div class="elem head">
                        <p>Suosittuja huonekasveja</p>
                    </div>
                    {#each listing as plant}
                        <div class="elem plant">
                            <div class="text">
                                <h2>{plant.name}</h2>
                                <p>{plant.latin}</p>
                            </div>
                            <button onclick={() => {selectPlant(plant.id)}} class="arrow">{">"}</button>
                        </div>
                    {/each}
                </div>
            {:else if status == State.SelectRuukku}
                <h1>Kuinka suuri ruukku kasvilla on?</h1>

                <div class="listing size">
                    {#each Object.entries(SIZES) as [size, [title, desc]]}
                        <div class="elem plant">
                            <div class="text">
                                <h2>{title}</h2>
                                <p>{desc}</p>
                            </div>
                            <button onclick={() => {}} class="arrow">{">"}</button>
                        </div>
                    {/each}
                </div>
            {:else}
            {/if}
        {/key}
    </div>
</main>

<style>
    main  {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: whitesmoke;
    }

    .header {
        width: calc(100% - 40px);
        height: 50px;
        position: absolute;
        top: 20px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .status {
        width: 40px;
        height: 40px;

        margin: 10px;

        background-color: white;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: 7px;
    }

    .status.selected {
        background-color: var(--accent-main);
    }


    .content {
        position: absolute;
        width: 100%;
        height: calc(100% - 70px);
        top: 50px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .content h1 {
        margin: 20px;
        margin-top: 50px;
        width: calc(100% - 40px);
    }

    .listing {
        width: 80%;
        padding: 10px;

        background-color: white;

        border-radius: 10px;

        overflow-y: scroll;
    }

    .listing.plants {
        height: 500px;
    }

    .listing.size {
        height: auto;
    }

    .listing .elem {
        padding-bottom: 5px;
        margin-bottom: 5px;

        border-bottom: solid 1px var(--border-main);
    }

    .elem.head {
        opacity: 0.6;
    }

    .elem.plant {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .elem.size {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }


    .elem.plant h2 {
        font-size: 1.2rem;
    }

    .elem.plant p {
        font-size: 0.9rem;
    }

    .elem button {
        box-shadow: none;
        background: none;

        color: var(--text-black);
        opacity: 0.5;
    }

    .elem.size p {
        margin-left: 10px;
    }
</style>


