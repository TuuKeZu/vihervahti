

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