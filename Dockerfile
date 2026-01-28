FROM golang:1.25 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o server ./server.go

FROM alpine:3.14 AS host
WORKDIR /app
COPY --from=builder /app/server ./server

COPY ./assets ./assets
COPY ./css ./css
COPY ./pages ./pages
COPY ./index.html ./index.html

EXPOSE 6767
CMD ["./server"]
