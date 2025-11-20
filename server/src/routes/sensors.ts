import express from 'express';
import { useAuth, useSensor, useState } from '../middleware/state';
import { onError, StateError } from '../error';
import Joi from 'joi';
import { validateBody, validateParams } from '@tuukezu/joi-express';
import { Sensor, SensorUpdateType } from '../schema';

import { v4 as uuidv4 } from 'uuid';


const router = express.Router();

router.post('/initialize', (req, res) => {
    const bodySchema = Joi.object({
        uuid: Joi.string().required(),
        serial: Joi.string().required(),
        code: Joi.string().required(),
        owner: Joi.string().allow(null).required()
    });

    const request = validateBody(req, res, bodySchema);
    if (!request) return null;

    const state = useState();
    const { uuid, code, serial, owner } = request;

    const sensor: Sensor = {
        uuid,
        owner,
        code,
        serial,
        paired: owner != null,
        commandQueue: [{ type: SensorUpdateType.Initialized, uuid: uuidv4() }]
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

router.get('/queue', (req, res) => {
    const sensor = useSensor(req, res).mapErr(res, onError);
    if (!sensor) return;

    res.json(sensor.commandQueue);
});

export default router;