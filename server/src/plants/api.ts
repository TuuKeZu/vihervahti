import fs from 'fs';
import { resolve } from 'path';
import { Result, StateError } from '../error';
const mapPath = './id-map.json';
const cachePath = './cache.json';

const { PERENUAL_API_KEY } = process.env;

export let map: { finnish: string, id: number }[] = [];
export let cache: Record<number, PlantCache> = {};


export interface PlantCache {
    finnish: string,
    latin: string,
    wateringIntervalDays: number,
    xWateringPeriod: string[],
    xWateringAvgVolumeRequirement: {
        unit: 'gallon' | 'liter',
        value: number,
    },
    xWateringBasedTemperature: {
        unit: 'celsius',
        min: number,
        max: number
    },
    xWateringPhLevel: {
        min: number,
        max: number
    }
}

export const initialize = () => {
    const _map = fs.readFileSync(mapPath, { encoding: 'utf-8' });
    const mdata: { finnish: string, id: number | null }[] = JSON.parse(_map);

    map = <{ finnish: string, id: number }[]>mdata.filter(({ id }) => id);

    const _cache = fs.readFileSync(cachePath, { encoding: 'utf-8' });
    const cdata: Record<number, any> = JSON.parse(_cache);

    cache = cdata;

    console.log('App cache initialized');
}

export const fetchId = (latin: string): Promise<number | null> => {
    return new Promise((resolve, reject) => {
        fetch(`https://perenual.com/api/v2/species-list?key=${PERENUAL_API_KEY}&q=${latin}`)
        .then(async res => {
            const data = (await res.json());
            console.log(data);

            const [entry, ..._] = data.data;

            if (!entry) return resolve(null);
            return resolve(entry.id ?? null);
        })
        .catch(err => {
            return reject(err);
        })
    })
}

/**
 * Turns out the api doesn't work...
 * 
 * Might as well leave the code, and instead just prepopulate the cache...
 */
export const fetchInfo = (id: number) => {
    return new Promise((resolve, reject) => {
        const stored = cache[`${id}`];

        console.log(stored);
        if (!stored)
            return reject(null);
        
        return resolve(stored);

        // fetch(`https://perenual.com/api/v2/species/details/${id}?key=${PERENUAL_API_KEY}`)
        // .then(async res => {
        //     const data = (await res.json());
        //     console.log(data);

        //     cache[id] = data.data;
        //     fs.writeFileSync(cachePath, JSON.stringify(cache));
        // })
        // .catch(err => {
        //     return reject(err);
        // })
    })
}

export const fetchPlantInfo = (id: number): Result<PlantCache, StateError> => {
    const stored = cache[`${id}`];

    if (!stored)
        return Result.err(StateError.FailedTofetchPlant)
    
    return Result.ok(stored)
}

export const listAvailablePlants = (): { id: string, name: string, latin: string }[] => {
    const entries = Object.entries(cache);

    return entries.map(([id, plant]) => ({
        id,
        name: plant.finnish,
        latin: plant.latin,
    }))
}