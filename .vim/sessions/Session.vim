let SessionLoad = 1
if &cp | set nocp | endif
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/documents/cour/algorithmes_et_optimisation_discrète/justify/src
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +198 src/altex-analyser.c
badd +1 src/altex-analyser.c~
badd +145 src/altex.c
badd +1 src/altex.c~
badd +1 src/altex-displayer.c
badd +1 src/altex-utilitaire.c
badd +62 src/paragraph.c
badd +82 src/vertices.c
badd +1 src/vertices.c~
badd +1 include/altex-analyser.h
badd +1 include/altex-analyser.h~
badd +1 include/altex-displayer.h
badd +1 include/altex.h
badd +1 include/altex-utilitaire.h
badd +86 include/paragraph.h
badd +30 include/vertices.h
badd +1 include/vertices.h~
badd +7 5114114
argglobal
silent! argdel *
edit src/vertices.c
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winheight=1 winwidth=1
exe 'vert 1resize ' . ((&columns * 111 + 113) / 227)
exe 'vert 2resize ' . ((&columns * 115 + 113) / 227)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 113 - ((45 * winheight(0) + 30) / 61)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
113
normal! 05|
wincmd w
argglobal
edit src/vertices.c
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 30) / 61)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
wincmd w
exe 'vert 1resize ' . ((&columns * 111 + 113) / 227)
exe 'vert 2resize ' . ((&columns * 115 + 113) / 227)
tabnext 1
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOc
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
