import time
from networking import commands;
from state import state
import core.mod as core
import core.gpio as gpio

def onTick():
    commands.fetchCommandQueue()
    pass

def main():
    print('> starting')
    commands.initialize()

    hardware = None

    if gpio.scan():
        hardware = gpio.SensorHardware()

    while True:
        onTick()
        if (hardware):
            core.onTick(hardware)
        time.sleep(3)

main()
