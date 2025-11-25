import time
from core.fs import save_to_history
from networking.commands import history

def onTick():
    entry = {
        't': int(time.time()),
        'd': 800,
        'tp': 24,
    }

    save_to_history(entry)
    history(entry)