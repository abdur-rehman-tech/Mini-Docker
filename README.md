MiniDocker

A lightweight Docker-like container runtime built in C using Linux namespaces and chroot().

Features
Process isolation using Linux namespaces
Lightweight container runtime written in C
Custom root filesystem support
Docker-like image structure
Runs real applications inside isolated environments
Manual shared library dependency handling using ldd
Technologies Used
C Programming
Linux System Calls
clone()
chroot()
PID Namespaces
UTS Namespaces
Mount Namespaces
Project Structure
docker/
├── Makefile
├── main.c
├── container.c
├── container.h
├── utils.c
├── utils.h
├── rootfs/
├── images/
└── minidocker
Build the Project
make
Run the Container
sudo ./minidocker /bin/bash
Example

Run a Node.js application inside the container:

sudo ./minidocker /bin/node

The project includes a custom image structure containing:

Node.js binary
Required .so shared libraries
Application files
How It Works

MiniDocker creates isolated environments using:

clone() for process creation
Linux namespaces for isolation
chroot() for filesystem isolation
Custom root filesystem setup

Shared library dependencies are manually copied into the container filesystem using:

ldd <binary>
Future Improvements
Docker-like CLI (run, build, images)
Dockerfile support
Container networking
Layered filesystem
Image registry support
Volume mounting
Learning Outcomes

This project helped in understanding:

How Docker works internally
Linux containerization concepts
Process and filesystem isolation
Dynamic linking in Linux
Low-level Linux system programming
Author

ABDUR REHMAN
