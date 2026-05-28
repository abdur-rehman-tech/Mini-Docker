#ifndef UTILS_H
#define UTILS_H

void setup_rootfs();
void run_image(char *image_name);
void build_image(char *image);

int generate_container_id();
void add_container(int cid, int pid, char *image);
int find_pid(int cid);

#endif
