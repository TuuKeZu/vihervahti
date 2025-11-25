import { fetchId } from './api';
import _db from './db.json';
import fs from 'fs';

const db = _db as { finnish: string, latin: string }[];
const path = './id-map.json';



const initialize = async () => {
    const _map = fs.readFileSync(path, { encoding: 'utf-8' });
    const map: { finnish: string, id: number | null }[] = JSON.parse(_map);

    for await (const plant of db) {
        await new Promise<void>(async (resolve, reject) => {
            const { finnish, latin } = plant;

            if (!(!map.find(({ finnish: _finnish }) => _finnish == finnish))) {
                console.log(`> ${finnish} exists`);
                return resolve()
            }

            console.log(`> fetching ${finnish}`);
            
            const id = await fetchId(latin);
            map.push({ finnish, id });
            fs.writeFileSync(path, JSON.stringify(map));
            
            setTimeout(() => {
                resolve()
            }, 3000);
        });
    }
}

initialize()
.then(() => {
    console.log("done!");
})