

export interface AvailableSensor {
    uuid: string;
    serial: string;
}

export interface Sensor {
    uuid: string;
    serial: string;
    paired: boolean;
    owner: string;
}

export enum PotSize {
    Small = 'SMALL',
    Medium = 'MEDIUM',
    Big = 'BIG'
}