import time
from networking import commands;
from state import state

def onTick():
    commands.fetchCommandQueue()
    pass

def main():
    print('> starting')
    commands.initialize()
    while True:
        onTick()
        time.sleep(3)

main()
