# 🐳 MiniDocker

![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=white) ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=white)

A lightweight, Docker-like container runtime written in **C**, built from scratch with **Linux namespaces** and **`chroot()`** to understand how containers really work under the hood.

> A container isn't a VM. It's a normal Linux process with a restricted view of the system.

## ✨ Features

- Process isolation with **PID, UTS and mount namespaces** via `clone()`
- Filesystem isolation with **`chroot()`** into a custom root filesystem
- Docker-like image structure (`images/`, `rootfs/`)
- Runs real applications (e.g. Bash, Node.js) inside the isolated environment
- Shared library dependencies resolved manually with **`ldd`**

## 🧠 How it works

```
 your app (bash / node)          ← runs as PID 1 inside the container
        │
 clone(CLONE_NEWPID | CLONE_NEWUTS | CLONE_NEWNS)
        │                        ← own process tree, hostname and mounts
 chroot(rootfs/)                 ← own root filesystem
        │
 custom rootfs: binary + .so libs (copied using ldd)
        │
 host Linux kernel               ← shared, no guest OS
```

## 📁 Project structure

```
Mini-Docker/
├── Makefile
├── main.c          # entry point / CLI
├── container.c/.h  # namespace + chroot logic
├── utils.c/.h      # helpers
├── images/         # image layout (e.g. node_app)
└── rootfs/         # container root filesystem
```

## 🚀 Build & run

```bash
make
sudo ./minidocker /bin/bash      # isolated shell
sudo ./minidocker /bin/node      # run Node.js inside the container
```

> Root is required because creating namespaces and calling `chroot()` need elevated privileges.

## 🗺️ Roadmap

- [ ] Docker-like CLI (`run`, `build`, `images`)
- [ ] cgroups for CPU/memory limits
- [ ] Container networking (network namespace + veth)
- [ ] Layered filesystem (OverlayFS)
- [ ] Volume mounts and an image registry

## 📚 What I learned

- How Docker isolates processes and filesystems internally
- Linux namespaces, `clone()` and `chroot()` at the system-call level
- Why container images and layers exist (dynamic linking is a dependency puzzle)

---

## 👤 Author

**Abdur Rehman** · DevSecOps Engineer · Founder of [ARTechOps](https://artechops.com)

[LinkedIn](https://www.linkedin.com/in/muhamad-abdur-rehman-81777b366/) · [GitHub](https://github.com/abdur-rehman-tech) · [artechops.com](https://artechops.com)
