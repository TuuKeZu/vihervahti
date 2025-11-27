import time
from networking import commands;
from state import state
import core.mod as core
import core.gpio as gpio

from threading import Thread

def onTick():
    commands.fetchCommandQueue()
    pass

def main():
    print("> starting")
    commands.initialize()

    hardware = None

    if gpio.scan():
        hardware = gpio.SensorHardware()

    def thread_1():
        while True:
            if (hardware):
                core.onTick(hardware)
            else:
                # mock results if hardware decides to die
                core.mockTick()
            time.sleep(15)

    def thread_2():
        while True:
            onTick()
            time.sleep(2)

    t1 = Thread(target=thread_1)
    t2 = Thread(target=thread_2)

    t1.start()
    t2.start()

    print("Initialized both threads")

main()
