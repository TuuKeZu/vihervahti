



export interface Sensor {
    uuid: string;
    commandQueue: AnySensorUpdate[];
    paired: boolean;
    owner: string | null;
    code: string;
    serial: string;
}

export type AnySensorUpdate = SensorUpdateBase | SensorUpdatePaired;

export enum SensorUpdateType {
    Initialized = 'INITIALIZED',
    Paired = 'PAIRED',
    Unpaired = 'UNPAIRED',
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