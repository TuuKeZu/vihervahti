
export interface Sensor {
    uuid: string;
    commandQueue: AnySensorUpdate[];
    paired: boolean;
    owner: string | null;
    code: string;
    serial: string;
    params: SensorParameters | null;
    history: HistoryEntry[]
}

export interface HistoryEntry {
    d: number;
    t: number;
    tp: number;
}

export type AnySensorUpdate = SensorUpdateBase | SensorUpdatePaired;

export enum SensorUpdateType {
    Initialized = 'INITIALIZED',
    Paired = 'PAIRED',
    Unpaired = 'UNPAIRED',
    Setup = 'SETUP'
}

export interface SensorUpdateBase {
    type: SensorUpdateType;
    uuid: string;
}

export interface SensorUpdatePaired extends SensorUpdateBase {
    type: SensorUpdateType.Paired;
    owner: string;
}

export interface SensorUpdateUnpaired extends SensorUpdateBase {
    type: SensorUpdateType.Unpaired;
}

export interface SensorUpdateSetup extends SensorUpdateBase {
    type: SensorUpdateType.Setup;
    params: SensorParameters;
}

export enum PotSize {
    Small = 'SMALL',
    Medium = 'MEDIUM',
    Big = 'BIG'
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