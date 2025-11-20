import type { Request, Response } from 'express';

export enum StateError {
    InvalidRequest,
    UnknownSensor,
    SensorExists,
    NotAllowed,
    AlreadyPaired,
    InvalidCode,
    Pass
}

export const ERROR_MAP: Record<StateError, [number, string]> = {
    [StateError.UnknownSensor]: [294, 'Unknown sensor'],
    [StateError.SensorExists]: [295, 'Sensor already exists'],
    [StateError.InvalidRequest]: [410, 'Invalid request'],
    [StateError.Pass]: [500, '!unreachable'],
    [StateError.NotAllowed]: [401, 'Not allowed'],
    [StateError.AlreadyPaired]: [401, 'Already paired'],
    [StateError.InvalidCode]: [401, 'Invalid code']
}

export class Result<T, E> {
    private _innerT: T | null;
    private _innerE: E | null;
    private _kind: ResultKind; 

    constructor(t: T | null, e: E | null, kind: ResultKind) {
        this._innerT = t;
        this._innerE = e;
        this._kind = kind;
    }

    static ok = <T, E>(t: T): Result<T, E>  => new Result<T, E>(t, null, ResultKind.Ok);
    static err = <T, E>(e: E): Result<T, E>  => new Result<T, E>(null ,e, ResultKind.Err);

    match = <A, B>(onOk: (t: T) => A, onErr: (e: E) => B): A | B => {
        switch (this._kind) {
            case ResultKind.Ok:
                return onOk(this._innerT as T)
            case ResultKind.Err:
                return onErr(this._innerE as E)
        }
    }

    mapErr = (res: Response, handleError: (e: E, res: Response) => void): T | null => {
        switch (this._kind) {
            case ResultKind.Ok:
                return this._innerT;
            case ResultKind.Err:
                handleError(this._innerE as E, res);
                return null;
        }
    }
}


enum ResultKind {
    Ok,
    Err
}
export interface Unit {};

export const onError = (err: StateError, res: Response): void => {
    if (err == StateError.Pass) return;
    
    const [status, info] = ERROR_MAP[err] ?? [500, 'unhandled error'];
    res.status(status).send(info);
}