#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mount.h>
#include <sys/stat.h>
#include <string.h>
#include <signal.h>
#include <fcntl.h>
#include <sys/wait.h>
#include "utils.h"

#define ROOTFS "./rootfs"

int generate_container_id()
{
    static int id = 1000;
    return __sync_fetch_and_add(&id, 1);
}

void add_container(int cid, int pid, char *image)
{
    FILE *f = fopen("containers.txt", "a");
    if (!f) return;

    fprintf(f, "%d %d %s running\n", cid, pid, image);
    fclose(f);
}

int find_pid(int cid)
{
    FILE *f = fopen("containers.txt", "r");
    if (!f) return -1;

    int id, pid;
    char img[256], status[50];

    while (fscanf(f, "%d %d %255s %49s", &id, &pid, img, status) == 4)
    {
        if (id == cid)
        {
            fclose(f);
            return pid;
        }
    }

    fclose(f);
    return -1;
}

void setup_rootfs()
{
    printf("[+] Setting up root filesystem...\n");

    if (chroot(ROOTFS) != 0)
    {
        perror("chroot failed (run with sudo)");
        exit(1);
    }

    chdir("/");

    mkdir("/proc", 0555);
    mount("proc", "/proc", "proc", 0, NULL);

    printf("[+] Root filesystem ready\n");
}


void run_image(char *image_name)
{
    printf("[+] Loading image: %s\n", image_name);

    mkdir("logs", 0755);   

    int cid = generate_container_id();

    pid_t pid = fork();

    if (pid < 0)
    {
        perror("fork failed");
        return;
    }

    if (pid == 0)
    {
        setup_rootfs();

        printf("[+] Executing container process...\n");

        char logfile[256];
        snprintf(logfile, sizeof(logfile), "logs/%d.log", cid);

        FILE *logf = fopen(logfile, "w+");
        if (!logf)
        {
            perror("log open failed");
            exit(1);
        }

        fflush(stdout);
        fflush(stderr);

        dup2(fileno(logf), STDOUT_FILENO);
        dup2(fileno(logf), STDERR_FILENO);

        

        char *cmd[] = {
            "/node_app/bin/node",
            "/node_app/app/app.js",
            NULL
        };

        execvp(cmd[0], cmd);

        perror("execvp failed");
        exit(1);
    }

    add_container(cid, pid, image_name);

    printf("[+] Container started CID=%d PID=%d\n", cid, pid);

    if (getenv("DETACHED") == NULL)
        waitpid(pid, NULL, 0);
}

void build_image(char *image)
{
    char path[256];
    snprintf(path, sizeof(path), "images/%s/Dockerfile", image);

    FILE *f = fopen(path, "r");
    if (!f)
    {
        perror("Dockerfile not found");
        return;
    }

    printf("[+] Building image: %s\n", image);

    char line[256];
    while (fgets(line, sizeof(line), f))
        printf("[BUILD] %s", line);

    fclose(f);

    printf("[+] Build completed\n");
}
