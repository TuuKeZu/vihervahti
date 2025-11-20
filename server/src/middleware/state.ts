import { NextFunction, Request, Response } from "express";
import { State } from "../state";
import Joi from "joi";
import { validateBody, validateHeaders } from "@tuukezu/joi-express";
import { Sensor } from "../schema";
import { Result, StateError } from "../error";

let _state: State | null = null;

export const useState = (): State => {
    if (!_state)
        _state = new State();

    return _state;
}   

export const useSensor = (req: Request, res: Response): Result<Sensor, StateError> => {
    const schema = Joi.object({ uuid: Joi.string().required() }).unknown(true);
    const request = validateHeaders(<any>req, <any>res, schema);

    if (!request)
        return Result.err(StateError.Pass);

    
    const { uuid } = request;
    const state = useState();

    return state.getSensor(uuid)
}

export const useAuthSensor = (req: Request, res: Response): Result<Sensor, StateError> => {
    const headerSchema = Joi.object({ 
        authentication: Joi.string().required(),
        uuid: Joi.string().required() 
    }).unknown(true);
    
    const headers = validateHeaders(<any>req, <any>res, headerSchema);
    if (!headers)
        return Result.err(StateError.Pass);


    const { authentication, uuid } = headers;
    const state = useState();
    
    return state.getSensor(uuid).match(
        (sensor) => {
            if (!sensor.paired || sensor.owner != authentication)
                return Result.err(StateError.NotAllowed);

            return Result.ok(sensor);
        },
        (err) => {
            return Result.err(err);
        }
    )
}

export const useAuth = (req: Request, res: Response): Result<string, StateError> => {
    const schema = Joi.object({ authentication: Joi.string().required() }).unknown(true);
    const request = validateHeaders(<any>req, <any>res, schema);

    if (!request)
        return Result.err(StateError.Pass);

    const { authentication } = request;

    return Result.ok(authentication)
}