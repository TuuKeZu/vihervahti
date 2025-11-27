import express from 'express';
import { useAuth, useAuthSensor, useSensor, useState } from '../middleware/state';
import { onError, StateError } from '../error';
import Joi from 'joi';
import { validateBody, validateParams } from '@tuukezu/joi-express';
import { Sensor, SensorUpdatePaired, SensorUpdateSetup, SensorUpdateType, SensorUpdateUnpaired } from '../schema';
import { fetchPlantInfo } from '../plants/api';

const router = express.Router();

router.post('/pair', (req, res) => {
    const bodySchema = Joi.object({
        code: Joi.string().allow(null).required(),
        uuid: Joi.string().allow(null).required(),
    });

    const request = validateBody(req, res, bodySchema);
    if (!request) return null;

    const auth = useAuth(req, res).mapErr(res, onError);
    if (!auth) return;

    const state = useState();
    const { code, uuid } = request;

    const sensor = state.querySensor(({ code: _code}) => code == _code).mapErr(res, onError);
    if (!sensor) return;

    if (sensor.paired)
        return onError(StateError.AlreadyPaired, res);

    if (sensor.code != code)
        return onError(StateError.InvalidCode, res);

    const cmd = state.sendCommand<SensorUpdatePaired>(sensor.uuid, { type: SensorUpdateType.Paired, owner: auth });

    res.status(200).send(cmd);
});

router.get('/get', (req, res) => {
    const sensor = useAuthSensor(req, res).mapErr(res, onError);
    if (!sensor) return;


    res.json({ ...sensor, commandQueue: [] });
});

router.get('/status', (req, res) => {
    const sensor = useAuthSensor(req, res).mapErr(res, onError);
    if (!sensor) return;

    res.json(sensor.latestStatus);
});

router.post('/unpair', (req, res) => {
    const sensor = useAuthSensor(req, res).mapErr(res, onError);
    if (!sensor) return;

    const state = useState();
    const cmd = state.sendCommand<SensorUpdateUnpaired>(sensor.uuid, { type: SensorUpdateType.Unpaired });

    res.status(200).send(cmd);
});

router.get('/sensors', (req, res) => {
    const state = useState();

    const list = state.listSensors(({ serial, uuid }) => ({ serial, uuid }));
    res.json(list);
});

router.get('/callback/:uuid/:commandUuid', (req, res) => {

    const paramSchema = Joi.object({
        uuid: Joi.string().required(),
        commandUuid: Joi.string().required(),
    });

    const request = validateParams(req, res, paramSchema);
    if (!request) return null;

    const { commandUuid, uuid } = request;
    const state = useState();

    res.json(state.commandCallback(uuid, commandUuid));
});

router.post('/setup', (req, res) => {
    const sensor = useAuthSensor(req, res).mapErr(res, onError);
    if (!sensor) return;

    const bodySchema = Joi.object({
        plantId: Joi.string().allow(null).required(),
        potSize: Joi.string().allow('SMALL', 'MEDIUM', 'BIG')
    });

    const request = validateBody(req, res, bodySchema);
    if (!request) return null;

    const state = useState();
    const { plantId, potSize } = request;

    const plant = fetchPlantInfo(plantId).mapErr(res, onError);
    if (!plant) return;

    const cmd = state.sendCommand(sensor.uuid, <SensorUpdateSetup>{ params: {
        plant,
        potSize
    }, type: SensorUpdateType.Setup });

    return res.status(200).send(cmd);
});



export default router;