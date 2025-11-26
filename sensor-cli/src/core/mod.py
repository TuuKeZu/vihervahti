import time
from core.fs import save_to_history
from core.gpio import SensorHardware
from networking.commands import history

def onTick(hardware: SensorHardware):
    entry = hardware.read()

    save_to_history(entry)
    history(entry)