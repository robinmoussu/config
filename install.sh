
INSTALL=""

INSTALL+=" base base-devel"
INSTALL+=" git"
INSTALL+=" zsh vim"
INSTALL+=" dialog wpa_supplicant"
INSTALL+=" grub-efi-x86_64 os-prober mtools libisoburn efibootmgr dosfstools fuse freetype2"
INSTALL+=" i3-wm i3status dmenu synapse"
INSTALL+=" libreoffice firefox chromium"

pacman -S $INSTALL --needed
