
INSTALL_PACKER=1
INSTALL_PACMAN=1
INSTALL_PACKER=1

if [ $UID -eq 0 ]
then
    PACMAN="pacman"
else
    PACMAN="pacman"
fi

declare -a INSTALL=(
"base base-devel wget"
"git"
"zsh vim"
"dialog wpa_supplicant"
"grub-efi-x86_64 os-prober mtools libisoburn efibootmgr dosfstools fuse freetype2"
"xorg-server xorg-server-utils xorg-apps xf86-video-intel"
"mdm"
"i3-wm i3status dmenu synapse"
"libreoffice firefox chromium"
"elinks links"
)

declare -a INSTALL_PACKER_PAQUET=(
"gdm"
"oh-my-zsh-git"
)

INSTALL_ALL=0
for i in ${!INSTALL[*]}
do
    if [ $INSTALL_ALL -eq 0 ] && [ $INSTALL_PACMAN -eq 1 ]
    then
        echo "Installer : ${INSTALL[i]} ? (y/n/a/c)"
        unset rep
        while [ -z "$rep" ]; do
            read rep
        done
        if [ $rep == "a" ]
        then
            INSTALL_ALL=1
        elif [ $rep == "c" ]
        then
            unset INSTALL
            INSTALL_PACMAN=0
        elif [ $rep != "y" ]
        then
            unset INSTALL[i]
        fi
    fi
done

INSTALL_ALL_PACKER=0
for i in ${!INSTALL_PACKER_PAQUET[*]}
do
    if [ $INSTALL_ALL_PACKER -eq 0 ] && [ $INSTALL_PACMAN -eq 1 ]
    then
        echo "Installer : ${INSTALL_PACKER_PAQUET[i]} ? (y/n/a/c)"
        unset rep
        while [ -z "$rep" ]; do
            read rep
        done
        if [ $rep == "a" ]
        then
            INSTALL_ALL_PACKER=1
        elif [ $rep == "c" ]
        then
            unset INSTALL_PACKER_PAQUET
            INSTALL_PACKER=0
        elif [ $rep != "y" ]
        then
            unset INSTALL_PACKER_PAQUET[i]
        fi
    fi
done

echo "Les pacquets suivant sont selectionnés :"
for i in ${!INSTALL[*]}
do
    echo " ${INSTALL[i]}"
done
for i in ${!INSTALL_PACKER_PAQUET[*]}
do
    echo " ${INSTALL_PACKER_PAQUET[i]}"
done
echo "Continuer ? (y/n)"
unset rep
while [ -z "$rep" ]; do
    read rep
done
if [ $rep != "y" ]
then
    exit
fi

echo "AUR : installer packer ? (y/n)"
unset rep
while [ -z "$rep" ]; do
    read rep
done
if [ $rep != "y" ]
then
    INSTALL_PACKER=1
else
    INSTALL_PACKER=0
fi

if [[ $INSTALL_PACMAN ]]
then
    $PACMAN -S --needed --noconfirm $INSTALL
fi


if [[ $INSTALL_PACKER ]]
then
    mkdir tmp_install
    cd tmp_install
    wget https://aur.archlinux.org/packages/pa/packer/packer.tar.gz
    tar -zxf packer.tar.gz
    cd packer
    makepkg -sf --asroot --noconfirm
    pacman -U packer*.tar.xz --noconfirm
    packer -Syu --noconfirm
    cd ../..
    rm -rf tmp_install
fi

if [[ $INSTALL_PACKER ]]
then
    packer -S --noconfirm $INSTALL
fi

