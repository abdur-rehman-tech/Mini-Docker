#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "container.h"
#include "utils.h"

void print_usage()
{
    printf("Usage:\n");
    printf("  ./minidocker run [-d] <image>\n");
    printf("  ./minidocker build <image>\n");
    printf("  ./minidocker ps\n");
    printf("  ./minidocker stop <id>\n");
    printf("  ./minidocker logs <id>\n");
    printf("  ./minidocker rm <id>\n");
}

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        print_usage();
        return 1;
    }

    printf("[+] Starting mini Docker...\n");

    
    if (strcmp(argv[1], "run") == 0)
    {
        if (argc < 3)
        {
            print_usage();
            return 1;
        }

        if (strcmp(argv[2], "-d") == 0)
        {
            setenv("DETACHED", "1", 1);
            run_image(argv[3]);
        }
        else
        {
            run_image(argv[2]);
        }
    }

    
    else if (strcmp(argv[1], "build") == 0)
    {
        build_image(argv[2]);
    }

    else if (strcmp(argv[1], "ps") == 0)
    {
        FILE *f = fopen("containers.txt", "r");
        if (!f)
        {
            perror("no containers");
            return 1;
        }

        char line[256];
        while (fgets(line, sizeof(line), f))
            printf("%s", line);

        fclose(f);
    }

    else if (strcmp(argv[1], "stop") == 0)
    {
        stop_container(atoi(argv[2]));
    }

   
else if (strcmp(argv[1], "logs") == 0)
{
    if (argc < 3)
    {
        print_usage();
        return 1;
    }

    char file[256];   

    snprintf(file, sizeof(file), "logs/%s.log", argv[2]);

    FILE *f = fopen(file, "r");
    if (!f)
    {
        perror("log not found");
        return 1;
    }

    char line[256];
    while (fgets(line, sizeof(line), f))
        printf("%s", line);

    fclose(f);
}

    
    else if (strcmp(argv[1], "rm") == 0)
    {
        int cid = atoi(argv[2]);

        FILE *f = fopen("containers.txt", "r");
        FILE *tmp = fopen("tmp.txt", "w");

        int id, pid;
        char img[256], status[50];

        while (fscanf(f, "%d %d %s %s", &id, &pid, img, status) == 4)
        {
            if (id == cid) continue;
            fprintf(tmp, "%d %d %s %s\n", id, pid, img, status);
        }

        fclose(f);
        fclose(tmp);

        remove("containers.txt");
        rename("tmp.txt", "containers.txt");

        printf("[+] Container removed\n");
    }

    return 0;
}
