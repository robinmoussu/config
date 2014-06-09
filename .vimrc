set nocompatible              " be iMproved, required
filetype off                  " required
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/Vundle.vim'
source ~/.vimrc.bundles
call vundle#end()            " required
filetype plugin indent on    " required
