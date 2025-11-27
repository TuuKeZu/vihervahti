from core.gpio import SensorHardware
import random
import time
class State:

    initialized: bool
    error: str | None
    paired: bool
    owner: str | None
    hardware: SensorHardware | None

    def __init__(self):
        self.initialized = False
        self.error = None
        self.paired = False
        self.owner = None

    def read_hardware(self):
        if not self.hardware:
            return {
                't': int(time.time()),
                'd': random.randint(300, 1200),
                'tp': random.randint(20, 24),
            }
        else:
            return self.hardware.read()

    def __str__(self):
        return f"initialized?: {self.initialized}, paired?: {self.paired}, owner?: {self.owner}, error?: {self.error}"
    
global state
state = State()