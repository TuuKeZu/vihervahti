import { writable, type Writable } from "svelte/store";
import type { Sensor } from "../schema";

const SENSOR_KEY = 'sensor:uuid';

export const setPairedSensor = (uuid: string) => {
    pairedSensor.set(uuid);
    localStorage.setItem(SENSOR_KEY, uuid);
}

export const clearPairedSensor = () => {
    pairedSensor.set(null);
    localStorage.removeItem(SENSOR_KEY);
}

export const loadPairedSensor = () => {
    const sensor = localStorage.getItem(SENSOR_KEY);
    if (!sensor) return null;

    return sensor;
}


export const pairedSensor: Writable<string | null> = writable(null);
export const sensor: Writable<Sensor | null> = writable(null);

export const loading: Writable<boolean> = writable(false);