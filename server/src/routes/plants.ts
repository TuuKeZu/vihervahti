import express from 'express';
import { useAuth, useAuthSensor, useSensor, useState } from '../middleware/state';
import { onError, StateError } from '../error';
import Joi from 'joi';
import { validateBody, validateParams } from '@tuukezu/joi-express';
import { Sensor, SensorUpdatePaired, SensorUpdateType, SensorUpdateUnpaired } from '../schema';
import { fetchPlantInfo, listAvailablePlants } from '../plants/api';

const router = express.Router();


router.get('/list', (req, res) => {
    const state = useState();

    const list = listAvailablePlants();
    res.json(list);
});


router.get('/:plantid', (req, res) => {
    const paramSchema = Joi.object({
        plantid: Joi.number().required(),
    });

    const request = validateParams(req, res, paramSchema);
    if (!request) return null;

    const { plantid } = request;

    const plant = fetchPlantInfo(plantid).mapErr(res, onError);
    if (!plant) return;
    
    res.json(plant);
});



export default router;