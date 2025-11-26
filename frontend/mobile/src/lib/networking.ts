import { loading } from "./store";

export const API_URL = 'http://localhost:8008/api';
const AUTH = 'ronja';

export interface FetchOptions {
    json: boolean;
    body: object | null;
    uuid: string | null;
}

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
    json: true,
    body: null,
    uuid: null
}

export const fetchApi = <T>(method: 'POST' | 'GET', url: string, options: Partial<FetchOptions> = DEFAULT_FETCH_OPTIONS): Promise<T> => {
    return new Promise((resolve, reject) => {
        fetch(`${API_URL}${url}`, { 
            method,
            headers: {
                "authentication": AUTH,
                ...(options.uuid ? { "uuid": options.uuid } : {}),
                ...(options.body  != null? {"Content-Type": 'application/json'} : {})
            },
            body: options.body != null ? JSON.stringify(options.body) : undefined
        })
        .then(async res => {
            if (res.status != 200)
                return reject(await res.text())

            const data = options.json ? await res.json() : await res.text();
            return resolve(data as T);
        })
        .catch(err => {
            return reject(err);
        })
    });
}

export const dispatchCommand = (serial: string, fetch: Promise<string>): Promise<void> => {
    loading.set(true);
    return new Promise((resolve, reject) => {
        fetch
        .then(async uuid => {
            let interval: number;

            interval = setInterval(() => {
                fetchApi('GET', `/interface/callback/${serial}/${uuid}?t=${(new Date()).getTime()}`, { json: false })
                .then(status => {
                    const loaded = status == "false";
                    console.log("loading...", loaded, loaded == false);
                    if (loaded == false) {
                        clearInterval(interval);
                        loading.set(false);
                        return resolve();
                    }
                })
                .catch(err => {
                    clearInterval(interval);
                    loading.set(false);
                    return reject(err);
                })
            }, 1000);
        })
        .catch(err => {
            return reject(err);
        })

    });
}