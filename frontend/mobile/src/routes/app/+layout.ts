import { loadPairedSensor, setPairedSensor } from '$lib/store.js';
import { redirect } from '@sveltejs/kit';


export const ssr = false;

export const load = ({ params }) => {
    const pairedSensor = loadPairedSensor();
    if (!pairedSensor)
        return redirect(303, '/');

    setPairedSensor(pairedSensor);
}