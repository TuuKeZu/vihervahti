import { Result, StateError, Unit } from "./error";
import { Sensor, AnySensorUpdate, SensorUpdateBase, SensorUpdatePaired, SensorUpdateType, SensorUpdateUnpaired } from "./schema";

import { v4 as uuidv4 } from 'uuid';

export class State {

    private sensors: Map<string, Sensor>;

    constructor() {
        this.sensors = new Map();
    }

    getSensor = (uuid: string): Result<Sensor, StateError> => {
        const sensor = this.sensors.get(uuid);
        if (!sensor)
            return Result.err(StateError.UnknownSensor);

        return Result.ok(sensor);
    }

    querySensor = (query: (sensor: Sensor) => boolean): Result<Sensor, StateError> => {
        const sensor = Array.from(this.sensors.values()).find(query);
        if (!sensor)
            return Result.err(StateError.UnknownSensor);

        return Result.ok(sensor);
    }

    listSensors = <T>(map: (sensor: Sensor) => T): T[] => {
        return Array.from(this.sensors.values()).map(sensor => map(sensor))
    }

    insertSensor = (sensor: Sensor): Result<Unit, StateError> => {
        if (this.sensors.has(sensor.uuid)) 
            return Result.err(StateError.SensorExists);
        
        this.sensors.set(sensor.uuid, sensor);
        return Result.ok({});
    }

    updateSensor = (uuid: string, updater: (sensor: Sensor) => Sensor): void => {
        const sensor = this.sensors.get(uuid);
        if (!sensor) return;

        this.sensors.set(uuid, updater(sensor));
    }

    sendCommand = <C extends SensorUpdateBase>(uuid: string, cmd: Omit<C, "uuid">): string | null => {
        const sensor = this.sensors.get(uuid);
        if (!sensor) return null;

        const commandUuid = uuidv4();
        this.updateSensor(sensor.uuid, (_sensor) => ({
            ..._sensor,
            commandQueue: [...sensor.commandQueue, { ...cmd, uuid: commandUuid }]
        }));

        return commandUuid
    }


    commandCallback = (uuid: string, commandUuid: string): boolean => {
        const sensor = this.sensors.get(uuid);
        if (!sensor) return true;
    
        const command = sensor.commandQueue.find(({ uuid: _uuid }) => commandUuid == _uuid);
        return !command
    }

    handleCommand = (uuid: string, commandUuid: string): void => {
        const sensor = this.sensors.get(uuid);
        if (!sensor) return;

        const command = sensor.commandQueue.find(({ uuid: _uuid}) => _uuid == commandUuid);
        if (!command) return;

        const COMMAND_MAP: Record<SensorUpdateType, (uuid: string, cmd: AnySensorUpdate) => void> = {
            [SensorUpdateType.Initialized]: (_, __) => { },
            [SensorUpdateType.Paired]: this.sensorPaired,
            [SensorUpdateType.Unpaired]: this.sensorUnpaired
        }

        COMMAND_MAP[command.type](uuid, command)

        this.updateSensor(uuid, (_sensor) => ({
            ..._sensor,
            commandQueue: sensor.commandQueue.filter(({ uuid: _uuid }) => _uuid != commandUuid)
        }));
    }

    private sensorPaired = (uuid: string, command: AnySensorUpdate) => {
        const cmd = command as SensorUpdatePaired;

        this.updateSensor(uuid, (_sensor) => ({
            ..._sensor,
            paired: true,
            owner: cmd.owner
        }));
    }

        private sensorUnpaired = (uuid: string, command: AnySensorUpdate) => {
        const _cmd = command as SensorUpdateUnpaired;

        this.updateSensor(uuid, (_sensor) => ({
            ..._sensor,
            paired: false,
            owner: null
        }));
    }
}