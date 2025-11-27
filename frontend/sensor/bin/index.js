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
// const WS_URL = 'http://localhost:8009';
const WS_URL = 'https://vihervahti-ws.rannasta-suomeen.fi/api';
const uuid = '1234-5';
const init = () => {
    const SETUP = document.getElementById('SETUP');
    const SETUP_SERIAL = document.getElementById('SETUP-SERIAL');
    const SETUP_CODE = document.getElementById('SETUP-CODE');
    const SMILE = document.getElementById('SMILE');
    const SMILE_IMG = document.getElementById('SMILE-IMG');
    const GOOD = document.getElementById('GOOD');
    const NEUTRAL = document.getElementById('NEUTRAL');
    const BAD = document.getElementById('BAD');
    const STATUS_GOOD = document.getElementById('STATUS-GOOD');
    const STATUS_NEUTRAL = document.getElementById('STATUS-NEUTRAL');
    const STATUS_BAD = document.getElementById('STATUS-BAD');
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
        SETUP_CODE.textContent = `Koodi ${packet.code}`;
    };
    const onSmile = (packet) => {
        console.log(packet);
        SMILE.style.display = 'flex';
        SETUP.style.display = 'none';
        [GOOD, NEUTRAL, BAD].forEach(elem => elem.style.display = 'none');
        switch (packet.smile) {
            case Smile.Happy:
                SMILE_IMG.src = 'static/img/HymyHyvä.svg';
                GOOD.style.display = 'flex';
                STATUS_GOOD.textContent = `${packet.days} päivää`;
                break;
            case Smile.Neutral:
                SMILE_IMG.src = 'static/img/HymyHeikko.svg';
                NEUTRAL.style.display = 'flex';
                STATUS_NEUTRAL.textContent = `${packet.amount} dl`;
                break;
            case Smile.Sad:
                SMILE_IMG.src = 'static/img/HymyHuono.svg';
                BAD.style.display = 'flex';
                STATUS_BAD.textContent = `${packet.amount} dl`;
                break;
        }
    };
};
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=index.js.map