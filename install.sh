
INSTALL_PACKER=1
INSTALL_PACMAN=1

if [ $UID -eq 0 ]
then
    PACMAN="pacman"
else
    PACMAN="sudo pacman"
fi

declare -a INSTALL=(
"base base-devel"
"git"
"zsh vim"
"dialog wpa_supplicant"
"grub-efi-x86_64 os-prober mtools libisoburn efibootmgr dosfstools fuse freetype2"
"i3-wm i3status dmenu synapse"
"libreoffice firefox chromium"
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

echo "Les pacquets suivant sont selectionnés :"
for i in ${!INSTALL[*]}
do
    echo " ${INSTALL[i]}"
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
    makepkg -sf
    $PACMAN -U packer*.tar.xz --noconfirm
    packer -Suya --noconfirm
    cd ..
    rm -rf tmp_install
fi
