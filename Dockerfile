FROM python:3.6

WORKDIR /usr/src/app

COPY requirements.txt ./
COPY chat.py ./

RUN [ "pip", "install", "--no-cache-dir", "-r", "requirements.txt" ]

EXPOSE 80

CMD [ "python", "./chat.py" ]
