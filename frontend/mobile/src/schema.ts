

export interface AvailableSensor {
    uuid: string;
    serial: string;
}

export interface Sensor {
    uuid: string;
    serial: string;
    paired: boolean;
    owner: string;
    params: SensorParameters;
    history: HistoryEntry[]
}

export interface HistoryEntry {
    d: number;
    t: number;
    tp: number;
}

export enum PotSize {
    Small = 'SMALL',
    Medium = 'MEDIUM',
    Big = 'BIG'
}

export interface InitSensorParameters {
    plantId: string;
    potSize: PotSize;
}

export interface SensorParameters {
    plant: PlantCache;
    potSize: PotSize;
}


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