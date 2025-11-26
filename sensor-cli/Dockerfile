FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
gcc git i2c-tools libgpiod-dev python3-libgpiod && \
pip install --upgrade pip gpiod websockets numpy pyserial && \
apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip setuptools

RUN pip install --no-cache-dir adafruit-blinka adafruit-python-shell requests RPI.GPIO adafruit-circuitpython-seesaw dotenv

WORKDIR /app

COPY . .