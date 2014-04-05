" Vim File
" AUTHOR:   robin_arch
" FILE:     .vimrc.markdown_equation.vim
" ROLE:     Vim syntax file for markdown_equation.
" CREATED:  2014-03-24 21:04:35
" MODIFIED: 2014-03-24 21:19:57
"
"if exists("b:current_syntax")
    "finish
"endif

syn match equation '\$[^$]\$' 
syn region equation start="\[" end="\]" fold

hi def link equation Constant

