FROM golang:1.19.5-alpine3.17

WORKDIR /usr/src/app

COPY . .

RUN go mod tidy

RUN go build -o ./out/dist .

CMD ./out/dist