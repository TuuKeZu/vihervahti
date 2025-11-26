"use strict";
var StatusType;
(function (StatusType) {
    StatusType["Setup"] = "SETUP";
    StatusType["Smile"] = "SMILE";
})(StatusType || (StatusType = {}));
var Smile;
(function (Smile) {
    Smile["Sad"] = "SAD";
    Smile["Neutral"] = "NEUTRAL";
    Smile["Happy"] = "HAPPY";
})(Smile || (Smile = {}));
const WS_URL = 'http://localhost:8009';
const uuid = '1234-5';
const init = () => {
    const SETUP = document.getElementById('SETUP');
    const SETUP_SERIAL = document.getElementById('SETUP-SERIAL');
    const SETUP_CODE = document.getElementById('SETUP-CODE');
    const SMILE = document.getElementById('SMILE');
    const socket = new WebSocket(WS_URL);
    socket.onopen = () => {
        socket.send(uuid);
        console.log("Connected!");
    };
    socket.onmessage = (_data) => {
        const { data } = _data;
        const packet = JSON.parse(data);
        onMessage(packet);
    };
    socket.onclose = () => {
        console.log("Disconnected");
    };
    const onMessage = (data) => {
        switch (data.type) {
            case StatusType.Setup:
                return onSetup(data);
            case StatusType.Smile:
                return onSmile(data);
        }
    };
    const onSetup = (packet) => {
        console.log(packet);
        SETUP.style.display = 'flex';
        SMILE.style.display = 'none';
        SETUP_SERIAL.textContent = packet.serial;
        SETUP_CODE.textContent = packet.code;
    };
    const onSmile = (packet) => {
        console.log(packet);
        SMILE.style.display = 'flex';
        SETUP.style.display = 'none';
    };
};
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=index.js.map