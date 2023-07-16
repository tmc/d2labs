FROM golang:1.20

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY *.go .
COPY graph/ graph/
COPY frontend-build/.gitkeep frontend-build/
RUN go build -v -x

COPY . .
RUN go build -v -o /usr/local/bin/server

CMD ["server"]

EXPOSE 8080
