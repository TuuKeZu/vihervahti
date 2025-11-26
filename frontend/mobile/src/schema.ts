

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
    history: HistoryEntry[];
    latestStatus: SmileStatus | null;
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


/* ========================== */

export interface BaseStatus {
    type: 'SETUP' | 'SMILE';
}

export interface SetupStatus extends BaseStatus {
    type: 'SETUP',
    serial: string;
    code: string;
}

export interface SmileStatus extends BaseStatus {
    type: 'SMILE',
    smile: Smile;
    percentage: number;
    temp: number;
    days: number;
    amount: number;
}

export enum StatusType {
    Setup = 'SETUP',
    Smile = 'SMILE'
}

export enum Smile {
    Sad = 'SAD',
    Neutral = 'NEUTRAL',
    Happy = 'HAPPY',
}