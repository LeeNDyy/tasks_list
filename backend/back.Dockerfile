
FROM golang:1.24-alpine3.20 AS builder

ENV CGO_ENABLED=0
    
WORKDIR /app
    
COPY go.mod ./
COPY go.sum ./
    
    # Загрузка зависимостей
RUN go mod download
    
    # Копируем исходники
COPY ./backend ./backend
RUN go build -o applinux ./backend
    
   
FROM alpine:3.20
    
WORKDIR /myapp
    
COPY --from=builder /app/applinux ./
    
EXPOSE 7080
    
CMD ["/myapp/applinux"]
    