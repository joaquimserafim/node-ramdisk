#!/usr/bin/env bash

set -e

mk_ram_disk() {
  local mount_point=/tmp/${2}

  if EXISTS=`mount | grep ${mount_point}`; then
    printf "device \"%s\" already mounted" ${mount_point} 1>&2
    exit 1
  fi

  local ramfs_size_sectors=$(($1*1024*1024/512))
  local ramdisk_dev=`hdid -nomount ram://${ramfs_size_sectors}`

  newfs_hfs -v 'ram disk' ${ramdisk_dev} > /dev/null
  mkdir -p ${mount_point} > /dev/null
  mount -o noatime -t hfs ${ramdisk_dev} ${mount_point} > /dev/null

  printf %s ${mount_point//[[:blank:]]/}
}

rm_ram_disk() {
  diskutil eject $1 -force > /dev/null
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