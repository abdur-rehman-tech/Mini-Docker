CC=gcc
CFLAGS=-Wall

all:
	$(CC) main.c container.c utils.c -o minidocker $(CFLAGS)

clean:
	rm -f minidocker
