import requests
from networking.mod import DEFAULT_HEADERS, API_URL, UUID, CODE, SERIAL, fetch
from networking.errors import handle_error
from commands.mod import handle_command

def fetchCommandQueue():
    res = fetch(lambda : requests.get(f'{API_URL}/sensor/queue', headers=DEFAULT_HEADERS))
    if res is None: return
    
    commands: list[dict[str, str]] = list(map(lambda res: dict(res), list(res.json())))

    for command in commands:
        handle_command(command)(command)
    


def initialize():
    print('> initializing device')
    payload = {
        'uuid': UUID,
        'code': CODE,
        'serial': SERIAL,
        'owner': None
    }
    res = fetch(lambda : requests.post(f'{API_URL}/sensor/initialize', json=payload, headers={ 'Content-Type': 'application/json' }))
    if res is None: return
    
    print('> device initialized')
    

def callback(commandUuid: str):
    res = fetch(lambda : requests.post(f'{API_URL}/sensor/queue/{commandUuid}', headers=DEFAULT_HEADERS))
    if res is None: return

    print(f'> handled {commandUuid}')
    
    