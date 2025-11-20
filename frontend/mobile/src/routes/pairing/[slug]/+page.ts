import { fetchApi } from "$lib/networking";
import { sensor, setPairedSensor } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import type { Sensor } from "../../../schema";

export const ssr = false;

export const load = ({ params }): { promise: Promise<string> } => {
    const { slug: uuid } = params;

        return {
            promise: new Promise((resolve ,reject) => {
                fetchApi<Sensor>('GET', '/interface/get', { uuid, json: true })
                .then(_sensor => {
                    setPairedSensor(_sensor.uuid);
                    sensor.set(_sensor);
            
                    return reject(null);
                })
                .catch(_ => {
                    return resolve(uuid);
                });
            })
        
        }
}