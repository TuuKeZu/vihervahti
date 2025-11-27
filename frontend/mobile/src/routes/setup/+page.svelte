<script lang="ts">
    import { goto } from "$app/navigation";
    import { dispatchCommand, fetchApi } from "$lib/networking";
    import { onMount } from "svelte";
    import { PotSize, type InitSensorParameters, type Sensor, type SensorParameters } from "../../schema";
    import { pairedSensor, sensor } from "$lib/store";
    import { fade } from "svelte/transition";
    import InfoBox from "../components/InfoBox.svelte";

    const SIZES = {
        [PotSize.Small]: ['Pieni', '(alle litra)'],
        [PotSize.Medium]: ['Keskikokoinen', '(1-5 litraa)'],
        [PotSize.Big]: ['Suuriä', '(yli 5 litraa)'],
    }

    enum State {
        SelectPlant,
        SelectRuukku, // :D,
        DisplayInfo
    }

    type Entry = { id: string, name: string, latin: string };

    let _state: State = $state(State.SelectPlant);
    let params: Partial<InitSensorParameters> = $state({})
    let listing: Entry[] = $state([]);


    const selectPlant = (id: string) => {
        params.plantId = id;
        _state = State.SelectRuukku;
    }

    const selectPot = (pot: PotSize) => {
        if (!$sensor) return;
        params.potSize = pot;

        dispatchCommand($sensor.serial, fetchApi('POST', '/interface/setup', { json: false, uuid: $pairedSensor, body: params }))
        .then(a => {
            _state = State.DisplayInfo;
        })
        .catch(err => {
            console.error(err)
        })
    }

    $effect(() => {
        fetchApi<Sensor>('GET', '/interface/get', { json: true, uuid: $pairedSensor })
        .then(_sensor => {
            sensor.set(_sensor);
        })
        .catch(err => {
            sensor.set(null);
            pairedSensor.set(null);
            goto('/');
        })

        _state;
    })

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
        <div onclick={() => _state = State.SelectPlant} class="status {_state == State.SelectPlant ? 'selected' : ''}">
            <p>1</p>
        </div>
        <div onclick={() => _state = State.SelectRuukku} class="status {_state == State.SelectRuukku ? 'selected' : ''}">
            <p>2</p>
        </div>
        <div onclick={() => _state = State.DisplayInfo} class="status {_state == State.DisplayInfo ? 'selected' : ''}">
            <p>3</p>
        </div>
    </div>
    <div class="content">
        {#key (_state)}
            {#if _state == State.SelectPlant}
                <h1>Valitse kasvi</h1>
        
                
                <div class="listing plants">
                    <div class="elem head">
                        <p>Suosittuja huonekasveja</p>
                    </div>
                    {#each listing as plant}
                        <div class="elem plant" transition:fade>
                            <div class="text">
                                <h2>{plant.name}</h2>
                                <p>{plant.latin}</p>
                            </div>
                            <button onclick={() => {selectPlant(plant.id)}} class="arrow">{">"}</button>
                        </div>
                    {/each}
                </div>

                <InfoBox>
                    <p>Voit selvittää kasvin lajin:</p>
                    <li class="list">
                        <p>* Luontoportti.fi -palvelusta</p>
                        <p>* Puhelimen AI-avustimella</p>
                        <p>* Kasviruukun kyljestä</p>
                    </li>
                </InfoBox>
            {:else if _state == State.SelectRuukku}
                <h1>Kuinka suuri ruukku kasvilla on?</h1>

                <div class="listing size">
                    {#each Object.entries(SIZES) as [size, [title, desc]]}
                        <div class="elem plant">
                            <div class="text">
                                <h2>{title}</h2>
                                <p>{desc}</p>
                            </div>
                            <button onclick={() => {selectPot(size as PotSize)}} class="arrow">{">"}</button>
                        </div>
                    {/each}
                </div>

                <InfoBox>
                    <p>Ruukun pitää olla riittävän kokoinen, jotta kasvin juurilla on tilaa kasvaa. Liian suuri ruukku voi kuitenkin säilöä liikaa kosteutta.</p>
                </InfoBox>
            {:else if _state == State.DisplayInfo}
                <section>
                    <div class="sun">
                        <div class="sun-img" ></div>
    
                        <p class="yellow">Suositus</p>
                        <h2>Sijoita kasvisi hajavaloon</h2>

                        <p>Hajavalo sopii parhaiten kasvillesi. Tämän jälkeen sinun tarvitsee vain noudattaa vihervahdin kasteluohjeita.</p>

                        <button onclick={() => goto('/app')}>Mahtavaa</button>
                    </div>

                </section>
                
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

        padding-bottom: 10px;

        border-bottom: solid 1px var(--border-main);
    }

    .status {
        width: 40px;
        height: 40px;

        margin: 10px;

        background-color: white;
        color: var(--accent-main);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        pointer-events: none;
    }

    .status.selected {
        background-color: var(--accent-main);
        color: var(--text-white);
    }


    .content {
        position: absolute;
        width: 100%;
        height: calc(100% - 100px);
        top: 80px;

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
        
        cursor: pointer;
    }

    .elem button:hover {
        opacity: 0.7;
    }

    .elem.size p {
        margin-left: 10px;
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;


        height: 100%;
        max-width: 250px;
    }

    section h1 {
        text-align: center;
    }

    .sun-img {
        width: 100px;
        height: 100px;
        
        margin: 20px;
        margin-top: 50px;
        

        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url(/icons/Valo.svg);
    }

    .sun {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
    }

    .sun .yellow {
        font-weight: bold;
        font-size: 1.4rem;
    }

    .sun h2 {
        margin-bottom: 10px;
        text-align: center;
    }

    .sun p {
        text-align: center;
    }

    .sun button {
        margin-top: 20px;
        padding: 7px;
        font-size: 1.2rem;
    }
</style>


