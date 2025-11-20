from collections.abc import Callable
from networking import commands
from requests import Response
from state import state

def unknown_sensor():
    commands.initialize()
    pass

def sensor_exists():
    state.initialized = True
    print('> Sensor already initialized')
    pass

def unknown():
    print('> unknown error')
    pass


def network():
    print('> network error')
    pass

ERROR_MAP: dict[int, Callable[[], None]] = {
    294: unknown_sensor,
    295: sensor_exists,
}

def handle_error(res: Response) -> Callable[[], None]:
    callback = ERROR_MAP[res.status_code]

    if callback is None:
        print(f'> error: {res.text}')
        return unknown
    
    return callback