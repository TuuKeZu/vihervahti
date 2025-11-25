import time
from networking import commands;
from state import state
import core.mod as core

def onTick():
    commands.fetchCommandQueue()
    pass

def main():
    print('> starting')
    commands.initialize()
    while True:
        onTick()
        core.onTick()
        time.sleep(3)

main()
