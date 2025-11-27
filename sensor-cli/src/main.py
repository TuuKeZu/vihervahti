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

    state.hardware = gpio.scan()

    def thread_1():
        while True:
            core.onTick()
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
