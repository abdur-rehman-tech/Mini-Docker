#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>

#include "container.h"

void stop_container(int cid)
{
    FILE *f = fopen("containers.txt", "r");
    FILE *tmp = fopen("tmp.txt", "w");

    if (!f || !tmp)
    {
        perror("file error");
        return;
    }

    int id, pid;
    char image[256], status[50];

    int found = 0;

    while (fscanf(f, "%d %d %255s %49s", &id, &pid, image, status) == 4)
    {
        if (id == cid)
        {
            found = 1;
            printf("[+] Stopping CID=%d PID=%d\n", id, pid);

            if (kill(pid, 0) == 0)
            {
                kill(pid, SIGKILL);
                printf("[+] Killed PID=%d\n", pid);
            }
            else
            {
                printf("[!] Already dead PID=%d\n", pid);
            }

            continue;
        }

        fprintf(tmp, "%d %d %s %s\n", id, pid, image, status);
    }

    fclose(f);
    fclose(tmp);

    remove("containers.txt");
    rename("tmp.txt", "containers.txt");

    if (!found)
        printf("Container not found\n");
}
