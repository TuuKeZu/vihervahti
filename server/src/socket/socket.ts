import { Socket } from "dgram";
import { WebSocketServer } from "ws";
import { BaseStatus, SetupStatus, SmileStatus, StatusType } from "../schema";
import { useState } from "../middleware/state";

const map: Map<number, any> = new Map();
const subscriptions: Map<number, string> = new Map();

export const init = () => {
    const server = new WebSocketServer({ 
        port: 8009 
    }, () => {
        console.log("Websocket server started on 8009");
    });


    server.on('connection', socket => {
        const idx = map.size + 1;
        map.set(idx, socket);

        console.log("Websocket connected")

        socket.on('message', (data) => {
            const uuid = data.toString();
            subscriptions.set(idx, uuid);

            const state = useState();
            state.getSensor(uuid).match(
                (sensor) => {
                    const { serial, code, paired } = sensor;

                    if (!paired)
                        sendSocketUpdate<SetupStatus>(uuid, StatusType.Setup, {
                            serial,
                            code
                        });
                    else {
                        if (sensor.latestStatus)
                            sendSocketUpdate<SmileStatus>(uuid, StatusType.Smile, sensor.latestStatus);
                    }
                        
                },
                (err) => {
                    console.error('no such sensor');
                }
            )
        })

        socket.on('close', () => {
            map.delete(idx);
            subscriptions.delete(idx);
            console.log("Websocket disconnected");
        })
    });
}

export const sendSocketUpdate = <E extends BaseStatus>(uuid: string, type: StatusType, data: Omit<E, "uuid" | "type">) => {
    const packet = {
        ...data,
        type
    }

    const _packet = JSON.stringify(packet);

    const [idx] = Array.from(subscriptions.entries()).map(([idx, _uuid]) => {
        if (_uuid == uuid) return idx;
        
        return null;
    }).filter(a => a);

    if (!idx) return;

    const socket = map.get(idx);
    socket.send(_packet);
    console.log("Sent update to", idx);
}