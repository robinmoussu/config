

# Liens

# Common link directory
COMMON_="config"
COMMON_DIR_="/home/"$COMMON_

LINK_=`ls -A $COMMON_DIR_ | grep -v .sh`

#USER_="/home/"`ls /home | grep -v $COMMON_`" /root"
USER_="/home/robin_arch /root"

for CURRENT_USER_ in $USER_; do
	for CURRENT_LINK_ in $LINK_; do 
		ln -sb $COMMON_DIR_/$CURRENT_LINK_ $CURRENT_USER_/$CURRENT_LINK_
	done
done



