
HISTORY_PATH = "../history.txt"

def save_to_history(entry: dict[str, str]):
    try:
        with open(HISTORY_PATH, 'a') as f:
            f.write(f"{entry['t']};{entry['d']};{entry['tp']}\n")
            f.flush()

    except:
        print("> Failed to save to history")


def load_history() -> list[dict[str, str]]:
    result = []
    try:
        with open(HISTORY_PATH) as f:
            for line in f.readlines():
                t, d, tp = line.strip().split(";")

                result.append({
                    't': t,
                    'd': d,
                    'tp': tp,
                })

        return result

    except:
        print("> Failed to load history")