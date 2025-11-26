import time
import os

import board

from adafruit_seesaw.seesaw import Seesaw


def scan():
    devices = os.system("i2cdetect -y 1 | grep 36")
    if devices == 0:
        return True
    else:
        print("no device on 0x36")
        return False

class SensorHardware ():
    
    def __init__(self):
        self.i2c_bus = board.I2C()  # uses board.SCL and board.SDA
        self.ss = Seesaw(self.i2c_bus, addr=0x36)

        print("> initialized hardware")

    def read(self):
        touch = self.ss.moisture_read()
        temp = self.get_temp()

        return {
            't': int(time.time()),
            'd': touch,
            'tp': temp,
        }   


