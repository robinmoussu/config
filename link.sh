

# Liens

# Common link directory
COMMON_="config"
COMMON_DIR_="/home/"$COMMON_

LINK_=`ls -A $COMMON_DIR_ | egrep -v -e .sh$ -e README`

#USER_="/home/"`ls /home | grep -v $COMMON_`" /root"
USER_="/home/robin_arch /root /home/robin"

for CURRENT_USER_ in $USER_; do
    echo ---- $CURRENT_USER_ ----
	for CURRENT_LINK_ in $LINK_; do
		echo ln -sb $COMMON_DIR_/$CURRENT_LINK_ $CURRENT_USER_/$CURRENT_LINK_
		ln -sb $COMMON_DIR_/$CURRENT_LINK_ $CURRENT_USER_/$CURRENT_LINK_
	done
done
