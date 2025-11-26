import pickle
from _config import CONFIG_PATH

def load_config() -> dict[str, str] | None:
    try:
        with open(CONFIG_PATH, 'rb') as f:
            config = pickle.load(f)
            print("> current configuration: ")
            print(config)
            return config
    except FileNotFoundError:
        print("> failed to load config")
        return None
    

def save_config(config: dict[str, str]):
        with open(CONFIG_PATH, 'ab') as f:
            pickle.dump(config, f)
    # try:
    # except:
    #     print("> failed to save config")
    