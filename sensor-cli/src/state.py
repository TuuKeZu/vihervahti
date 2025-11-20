class State:

    initialized: bool
    error: str | None
    paired: bool
    owner: str | None

    def __init__(self):
        self.initialized = False
        self.error = None
        self.paired = False
        self.owner = None

    def __str__(self):
        return f"initialized?: {self.initialized}, paired?: {self.paired}, owner?: {self.owner}, error?: {self.error}"

global state
state = State()