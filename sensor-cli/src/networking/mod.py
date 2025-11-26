from collections.abc import Callable
from requests.exceptions import RequestException;
from requests import Response
from networking.errors import network, handle_error
import os
import time
from _config import UUID

DEFAULT_HEADERS = { 'uuid': UUID }

def fetch(fetch: Callable[[], Response]) -> Response | None:
    try:
        res = fetch()

        if res.status_code != 200:
            handle_error(res)()
            return None
        
        return res

    except RequestException:
        network()
        return None
        