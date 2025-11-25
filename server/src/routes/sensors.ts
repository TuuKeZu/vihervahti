import express from 'express';
import { useAuth, useSensor, useState } from '../middleware/state';
import { onError, StateError, toNull } from '../error';
import Joi from 'joi';
import { validateBody, validateParams } from '@tuukezu/joi-express';
import { Sensor, SensorUpdateType } from '../schema';

import { v4 as uuidv4 } from 'uuid';
import { fetchInfo, fetchPlantInfo } from '../plants/api';


const router = express.Router();

router.post('/initialize', (req, res) => {
    const bodySchema = Joi.object({
        uuid: Joi.string().required(),
        serial: Joi.string().required(),
        code: Joi.string().required(),
        owner: Joi.string().allow(null).required(),
        parameters: Joi.object({ plantId: Joi.number().required(), potSize: Joi.string().required().allow('SMALL', 'MEDIUM', 'BIG') }).allow(null).required(),
        history: Joi.array().items(Joi.object({ t: Joi.number().required(), d: Joi.number().required(), tp: Joi.number().required() }))
    });

    const request = validateBody(req, res, bodySchema);
    if (!request) return null;

    const state = useState();
    const { uuid, code, serial, owner, parameters, history } = request;

    const plant = parameters ? fetchPlantInfo(parameters.plantId).mapErr(res, toNull) : null;

    const sensor: Sensor = {
        uuid,
        owner,
        code,
        serial,
        paired: owner != null,
        commandQueue: [{ type: SensorUpdateType.Initialized, uuid: uuidv4() }],
        params: plant ? {
            plant,
            potSize: parameters.pot
        } : null,
        history
    }   

    const result = state.insertSensor(sensor).mapErr(res, onError);
    if (!result) return;

    res.status(200).send('Success');
});

router.post('/queue/:uuid', (req, res) => {
    const sensor = useSensor(req, res).mapErr(res, onError);
    if (!sensor) return;
    
    const paramSchema = Joi.object({
        uuid: Joi.string().required(),
    });

    const request = validateParams(req, res, paramSchema);
    if (!request) return null;

    const state = useState();
    const { uuid: commandUuid } = request;

    state.handleCommand(sensor.uuid, commandUuid);

    res.status(200).send('Success');
});

router.post('/history', (req, res) => {
    const sensor = useSensor(req, res).mapErr(res, onError);
    if (!sensor) return;
    
    const bodySchema = Joi.object({
        history: Joi.array().items(Joi.object({ t: Joi.number().required(), d: Joi.number().required(), tp: Joi.number().required() }))
    });

    const request = validateBody(req, res, bodySchema);
    if (!request) return null;

    const state = useState();
    const { history } = request;

    state.updateSensor(sensor.uuid, (sensor) => ({
        ...sensor,
        history: [...sensor.history, ...history]
    }));

    res.status(200).send('Success');
});

router.get('/queue', (req, res) => {
    const sensor = useSensor(req, res).mapErr(res, onError);
    if (!sensor) return;

    res.json(sensor.commandQueue);
});

export default router;