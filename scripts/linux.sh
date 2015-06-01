#!/usr/bin/env bash

set -e

mk_ram_disk() {
  local ramfs_size_mb=$1
  local mount_point=/tmp/${2}

  if EXISTS=`mount | grep ${mount_point}`; then
    printf "device \"%s\" already mounted" ${mount_point} 1>&2
    exit 1
  fi

  mkdir ${mount_point} > /dev/null
  chmod 777 ${mount_point} > /dev/null
  sudo mount -t tmpfs -o size=${ramfs_size_mb}M tmpfs ${mount_point}/ > /dev/null

  printf %s ${mount_point//[[:blank:]]/}
}

rm_ram_disk() {
  sudo umount $1 > /dev/null
  rm -rf $1 > /dev/null
}

main() {
  if [ "$1" = "1" ]; then
    mk_ram_disk $2 $3
  else
    rm_ram_disk $2
  fi
}

main $@