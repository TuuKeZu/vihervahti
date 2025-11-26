

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

const WS_URL = 'http://localhost:8009';
const uuid = '1234-5';


const init = () => {
    const SETUP = document.getElementById('SETUP') as HTMLElement;

    const SETUP_SERIAL = document.getElementById('SETUP-SERIAL') as HTMLElement;
    const SETUP_CODE = document.getElementById('SETUP-CODE') as HTMLElement;

    const SMILE = document.getElementById('SMILE') as HTMLElement;

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
        SETUP_CODE.textContent = packet.code;
    }
    
    const onSmile = (packet: SmileStatus) => {
        console.log(packet);

        SMILE.style.display = 'flex';
        SETUP.style.display = 'none';
    }
}



document.addEventListener('DOMContentLoaded', init);