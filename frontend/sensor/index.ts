

interface BaseStatus {
    type: 'SETUP' | 'SMILE';
}

interface SetupStatus extends BaseStatus {
    type: 'SETUP',
    serial: string;
    code: string;
}

interface SmileStatus extends BaseStatus {
    type: 'SMILE',
    smile: Smile;
    percentage: number;
    temp: number;
    days: number;
    amount: number;
}

enum StatusType {
    Setup = 'SETUP',
    Smile = 'SMILE'
}

enum Smile {
    Sad = 'SAD',
    Neutral = 'NEUTRAL',
    Happy = 'HAPPY',
}

// const WS_URL = 'http://localhost:8009';
const WS_URL = 'https://vihervahti-ws.rannasta-suomeen.fi/api';
const uuid = '1234-5';


const init = () => {
    const SETUP = document.getElementById('SETUP') as HTMLElement;

    const SETUP_SERIAL = document.getElementById('SETUP-SERIAL') as HTMLElement;
    const SETUP_CODE = document.getElementById('SETUP-CODE') as HTMLElement;

    const SMILE = document.getElementById('SMILE') as HTMLElement;

    const SMILE_IMG = document.getElementById('SMILE-IMG') as HTMLImageElement;

    const GOOD = document.getElementById('GOOD') as HTMLElement;
    const NEUTRAL = document.getElementById('NEUTRAL') as HTMLElement;
    const BAD = document.getElementById('BAD') as HTMLElement;

    const STATUS_GOOD = document.getElementById('STATUS-GOOD') as HTMLElement;
    const STATUS_NEUTRAL = document.getElementById('STATUS-NEUTRAL') as HTMLElement;
    const STATUS_BAD = document.getElementById('STATUS-BAD') as HTMLElement;

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        socket.send(uuid);
        console.log("Connected!");
    }

    socket.onmessage = (_data) => {
        const { data } = _data;
        const packet = JSON.parse(data);

        onMessage(packet);
    }

    socket.onclose = () => {
        console.log("Disconnected");
    }

    const onMessage = (data: SmileStatus | SetupStatus) => {
        switch (data.type) {
            case StatusType.Setup:
                return onSetup(data)
            case StatusType.Smile:
                return onSmile(data)
        }
    }
    
    const onSetup = (packet: SetupStatus) => {
        console.log(packet);
        
        SETUP.style.display = 'flex';
        SMILE.style.display = 'none';

        SETUP_SERIAL.textContent = packet.serial;
        SETUP_CODE.textContent = `Koodi ${packet.code}`;
    }
    
    const onSmile = (packet: SmileStatus) => {
        console.log(packet);

        SMILE.style.display = 'flex';
        SETUP.style.display = 'none';

        [GOOD, NEUTRAL, BAD].forEach(elem => elem.style.display = 'none');

        switch (packet.smile) {
            case Smile.Happy:
                SMILE_IMG.src = 'static/img/HymyHyvä.svg';
                GOOD.style.display = 'flex';
                STATUS_GOOD.textContent = `${packet.days} päivää`;
                break
           case Smile.Neutral:
                SMILE_IMG.src = 'static/img/HymyHeikko.svg';
                NEUTRAL.style.display = 'flex';
                STATUS_NEUTRAL.textContent = `${packet.amount} dl`;
                break
           case Smile.Sad:
                SMILE_IMG.src = 'static/img/HymyHuono.svg';
                BAD.style.display = 'flex';
                STATUS_BAD.textContent = `${packet.amount} dl`;
                break
        }
    }
}



document.addEventListener('DOMContentLoaded', init);