from collections.abc import Callable
from networking import commands
from state import state


def initialized(command: dict[str, str]):
    uuid = command['uuid']
    state.initialized = True

    commands.callback(uuid)
    print('> Device successfully initialized')
    pass

def paired(command: dict[str, str]):
    uuid = command['uuid']
    owner = command['owner']
    state.owner = owner
    state.paired = True

    commands.callback(uuid)
    print('> Device succesfully paired')

    pass

def unpaired(command: dict[str, str]):
    uuid = command['uuid']
    state.owner = None
    state.paired = False

    commands.callback(uuid)
    print('> Device succesfully unpaired')

def unknown(command: dict[str, str]):
    print('unknown command')
    pass

COMMAND_MAP: dict[str, Callable[[], None]] = {
    'INITIALIZED': initialized,
    'PAIRED': paired,
    'UNPAIRED': unpaired
}

def handle_command(command: dict) -> Callable[[], None]:
    print(f'> command: {command['type']}')
    callback = COMMAND_MAP[command['type']]

    if callback is None:
        return unknown
    
    return callback