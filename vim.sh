
COMMON="/home/config"

rm -rf $COMMON/.vim/bundle/Vundle.vim
git clone https://github.com/gmarik/Vundle.vim.git $COMMON/.vim/bundle/Vundle.vim
mv -b $COMMON/.vimrc .vimrc.backup
mv -f $COMMON/.vimrc.install $COMMON/.vimrc
vim +BundleInstall +BundleClean +BundleUpdate +wqa
mv $COMMON/.vimrc.backup $COMMON/.vimrc
