import requests
from _config import API_URL, UUID, CODE, SERIAL
from networking.mod import DEFAULT_HEADERS, fetch
from commands.mod import handle_command
from config.mod import load_config
from core.fs import load_history

def fetchCommandQueue():
    res = fetch(lambda : requests.get(f"{API_URL}/sensor/queue", headers=DEFAULT_HEADERS))
    if res is None: return
    
    commands: list[dict[str, str]] = list(map(lambda res: dict(res), list(res.json())))

    for command in commands:
        handle_command(command)(command)
    


def initialize():
    payload = {
        'uuid': UUID,
        'code': CODE,
        'serial': SERIAL,
        'owner': None,
        'parameters': None,
        'history': []
    }

    print("> initializing device")
    config = load_config()
    history = load_history()

    if config is not None:
        payload['parameters'] = {
            'plantId': config['plant']['id'],
            'potSize': config['potSize']
        }

    payload['history'] = history
    
    res = fetch(lambda : requests.post(f"{API_URL}/sensor/initialize", json=payload, headers={ 'Content-Type': 'application/json' }))
    if res is None: return
    
    print("> device initialized")
    

def callback(commandUuid: str):
    res = fetch(lambda : requests.post(f"{API_URL}/sensor/queue/{commandUuid}", headers=DEFAULT_HEADERS))
    if res is None: return

    print(f"> handled {commandUuid}")

def history(entry: dict[str, str]):
    res = fetch(lambda : requests.post(f"{API_URL}/sensor/history", headers=DEFAULT_HEADERS, json={ 'history': [entry] }))
    if res is None: return

    print(f"> history {entry}")
    
    