#!/usr/bin/env zsh

#echo tausrnetuarie
if [ $# = 0 ]; then
   # list
   echo Liste des partitions \n
   for DISKLABEL in `find /dev/disk/by-label/ -type l`; do RES=`readlink -f $DISKLABEL`;
      grep -q "RES" /proc/mounts ||echo "$RES ${DISKLABEL//*\//}"
   done
else
   if [ $1 = "-u" ]; then # umount
   
      cible=$2
      echo Démontage de la partition $cible

      # on démonte la partition
      for DISKLABEL in `find /dev/disk/by-label/ -type l`; do RES=`readlink -f $DISKLABEL`;
         if [ "${cible//*\//}" = "${DISKLABEL//*\//}" ]; then
            umount "$RES" 
         fi
      done

      # on retire l'alias des alias temporaires pour les nouveaux shell
      sed -i".bak" "\#$cible#d" /home/common/tmp_alias.sh
      # on enleve l'alias du shell courant
      unalias "${cible//*\//}"

   else # mount
   
      cible=$1
      echo Montage de la partition $cible

      # on cherche la partition correspondant au label
      for DISKLABEL in `find /dev/disk/by-label/ -type l`; do RES=`readlink -f $DISKLABEL`;
         if [ "$cible" = "${DISKLABEL//*\//}" ]; then
            
            dest_folder="/run/media/$USER/$cible"

            # creation d'un alias global
            alias -g $cible=$dest_folder
            echo "alias -g $cible=$dest_folder" >> /home/common/tmp_alias.sh

            mkdir $dest_folder -p
            chown robin_arch:robin $dest_folder
            mount $RES $dest_folder
            cd $dest_folder

         fi
      done
   fi
fi
