import time
from core.fs import save_to_history
from core.gpio import SensorHardware
from networking.commands import history
import random

def onTick(hardware: SensorHardware):
    entry = hardware.read()

    save_to_history(entry)
    history(entry)

def mockTick():
    entry = {
        't': int(time.time()),
        'd': random.randint(300, 1200),
        'tp': random.randint(20, 24),
    }

    save_to_history(entry)
    history(entry)