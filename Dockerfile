FROM golang:1.25 AS server_builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o server ./server.go

FROM node:24-alpine AS generator
WORKDIR /app
RUN apk add --no-cache bash
COPY . . 
RUN npm ci
RUN npm run build

FROM alpine:3.14 AS host
WORKDIR /app
COPY --from=server_builder /app/server ./server
COPY --from=generator /app/public ./public
EXPOSE 6767
CMD ["./server"]
