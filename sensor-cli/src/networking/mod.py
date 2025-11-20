from collections.abc import Callable
from requests.exceptions import RequestException;
from requests import Response
from networking.errors import network, handle_error
import os
import time

# API_URL = os.getenv('API_URL')
# uuid = os.getenv('DEVICE_UUID')
API_URL = 'http://localhost:8008/api'
UUID = '1234-5'
CODE = '99999'
SERIAL = '9876-5'

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
        