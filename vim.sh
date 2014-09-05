
COMMON="/nfs/home/rmoussu"

rm -rf $COMMON/.vim/bundle/Vundle.vim
git clone https://github.com/gmarik/Vundle.vim.git $COMMON/.vim/bundle/Vundle.vim
mv -b $COMMON/.vimrc $COMMON/.vimrc.backup
cp -f $COMMON/.vimrc.install $COMMON/.vimrc
vim +BundleInstall +BundleClean +BundleUpdate +wqa
mv $COMMON/.vimrc.backup $COMMON/.vimrc
