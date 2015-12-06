" vim: set sw=4 ts=4 sts=4 et tw=78 foldmarker={,} foldlevel=0 foldmethod=marker :
"
"   This is the personal .vimrc file of Robin Moussu.
"
"   It's a derivated work of Steve Francia.
"   You can find it at http://spf13.com
" }

" Environment {
    set nocompatible
" }

" Bundle {
    " Setup Bundle Support {
        " The next three lines ensure that the ~/.vim/bundle/ system works
        filetype off
        " #set rtp+=~/.vim/bundle/Vundle.vim
        set rtp+=~/.vim/bundle/vundle
        call vundle#rc()
    " }

    Bundle 'gmarik/vundle'
    Bundle 'MarcWeber/vim-addon-mw-utils'
    Bundle 'tomtom/tlib_vim'

    " General {
        Bundle 'tpope/vim-vividchalk'
        Bundle 'scrooloose/nerdtree'
        Bundle 'tpope/vim-surround'
        "Bundle 'Raimondi/delimitMate'
        "Bundle 'spf13/vim-autoclose'
        Bundle 'vim-scripts/sessionman.vim'
        Bundle 'bling/vim-airline'
        "Bundle 'Lokaltog/vim-easymotion'
        "Bundle 'godlygeek/csapprox'
        Bundle 'jistr/vim-nerdtree-tabs'
        Bundle 'flazz/vim-colorschemes'
        Bundle 'mbbill/undotree'
        Bundle 'vim-scripts/restore_view.vim'
        Bundle 'mhinz/vim-signify'
        "Bundle 'tpope/vim-abolish.git'
        Bundle 'osyo-manga/vim-over'
        "Bundle 'justinmk/vim-sneak'
        "Bundle 'FredKSchott/covim'
        Bundle 'vim/textformat'

        " Added
        Bundle 'nelstrom/vim-visual-star-search'
        Bundle 'vim-scripts/whitespaste.vim'
        Bundle 'ervandew/supertab'
        "Bundle 'robinmoussu/template'
        "Bundle 'vim-scripts/Align'
    " }

    " General Programming {
        " Pick one of the checksyntax, jslint, or syntastic
        Bundle 'scrooloose/syntastic'
        Bundle 'tpope/vim-fugitive'
        Bundle 'mattn/webapi-vim'
        Bundle 'mattn/gist-vim'
        Bundle 'scrooloose/nerdcommenter'
        "Bundle 'godlygeek/tabular'
        Bundle 'vim-scripts/a.vim'
        "Bundle 'vim-scripts/header.vim'
        Bundle 'xolox/vim-reload'
        Bundle 'xolox/vim-misc'
        Bundle 'drmikehenry/vim-headerguard'
        Plugin 'airblade/vim-gitgutter'
        if executable('ctags')
            set tags=./tags;/
            Bundle 'majutsushi/tagbar'
            "Bundle 'xolox/vim-easytags'
        endif

        "if executable("cscope")
            "Plugin 'vim-scripts/cscope.vim'

            "set csprg=/usr/bin/cscopeprg
            "set csto=0
            "set cst
            "set nocsverb
            "" add any database in current directory
            "if filereadable("cscope.out")
                "cs add cscope.out
            "" else add database pointed to by environment
            "elseif $CSCOPE_DB != ""
                "cs add $CSCOPE_DB
            "endif
        "endif
    " }

    " Snippets & AutoComplete {
        Bundle 'Shougo/neocomplete.vim'
        Bundle 'Shougo/neosnippet'
        Bundle 'honza/vim-snippets'
    " }

    " cpp {
        Plugin 'octol/vim-cpp-enhanced-highlight'
    " }

    "" PHP {
        Bundle 'spf13/PIV'
        Bundle 'arnaud-lb/vim-php-namespace'
    " }

    "" Python {
        "" Pick either python-mode or pyflakes & pydoc
        "Bundle 'klen/python-mode'
        "Bundle 'python.vim'
        "Bundle 'python_match.vim'
        "Bundle 'pythoncomplete'
    "" }

    "" Javascript {
        Bundle 'elzr/vim-json'
        Bundle 'groenewege/vim-less'
        Bundle 'pangloss/vim-javascript'
        Bundle 'briancollins/vim-jst'
        Bundle 'kchmck/vim-coffee-script'
    " }

    " Java {
        Bundle 'derekwyatt/vim-scala'
        Bundle 'derekwyatt/vim-sbt'
    " }

    "" Haskell {
        Bundle 'travitch/hasksyn'
        Bundle 'dag/vim2hs'
        Bundle 'Twinside/vim-haskellConceal'
        Bundle 'lukerandall/haskellmode-vim'
        Bundle 'eagletmt/neco-ghc'
        Bundle 'eagletmt/ghcmod-vim'
        "Bundle 'Shougo/vimproc'
        Bundle 'adinapoli/cumino'
        Bundle 'bitc/vim-hdevtools'
    " }

    " HTML {
        "Bundle 'amirh/HTML-AutoCloseTag'
        Bundle 'hail2u/vim-css3-syntax'
        Bundle 'gorodinskiy/vim-coloresque'
        "Bundle 'tpope/vim-haml'
    " }

    " Ruby {
        Bundle 'tpope/vim-rails'
        let g:rubycomplete_buffer_loading = 1
        "let g:rubycomplete_classes_in_global = 1
        "let g:rubycomplete_rails = 1
    " }

    "" Go Lang {
        "Bundle 'Blackrush/vim-gocode'
    "" }

    " Misc {
        Bundle 'tpope/vim-markdown'
        Bundle 'spf13/vim-preview'
        Bundle 'tpope/vim-cucumber'
        Bundle 'quentindecock/vim-cucumber-align-pipes'
        Bundle 'Puppet-Syntax-Highlighting'
    " }

    "" Twig {
        "Bundle 'beyondwords/vim-twig'
    "" }

    " Latex {
        "Bundle 'bccalc.vim'
        "Bundle 'jcf/vim-latex'
    " }

    " Arduino {
        "Bundle 'jplaut/vim-arduino-ino'
    " }

" }

" General {
    source ~/.vimrc.general

    colorscheme molokai
    "colorscheme darkblack
    "highlight Visual       ctermfg=red       ctermbg=black
    "highlight VisualNOS    ctermfg=red       ctermbg=grey
    "highlight Search       ctermfg=blue      ctermbg=black
    "highlight IncSearch    ctermfg=blue      ctermbg=black
    "highlight ErrorMsg     ctermfg=black     ctermbg=Red guifg=White guibg=Red
    "highlight StatusLine   ctermfg=37        ctermbg=black
    "highlight StatusLineNC ctermfg=37        ctermbg=black
    "highlight WildMenu     ctermfg=Lightgray ctermbg=black
    "highlight TabLineSel   ctermfg=Lightgray ctermbg=black
    "highlight Normal       ctermfg=94     ctermbg=none
" }

" Autocomand {
    autocmd FileType c   map <buffer> ê :exec ':wa\|!clear && echo "--------------------------------------------------" && make \|\| (clear && echo "--------------------------------------------------" && gcc -std=c99   -fdiagnostics-color=always ' . expand('%:h:h'). '/*.c && ' . expand('%:h:h') . '/a.out)'
    autocmd FileType c++ map <buffer> ê :wa\|!clear && echo "--------------------------------------------------" && make \|\| (clear && echo "--------------------------------------------------" &&     g++ -std=gnu11 -fdiagnostics-color=always *.c *.cpp && ./a.out)
    autocmd FileType make map <buffer> ê :wa\|!clear && echo "--------------------------------------------------" && make
    autocmd BufEnter *.lus map <buffer> ê :exec ':wa\|!luciole % ' . expand('%:r')
    autocmd BufEnter *.dot map <buffer> ê :exec ':wa\|!dot -Tpng % > ' . expand('%:r') . '.png && eog ' . expand('%:r') . '.png'
    autocmd FileType ruby map <buffer> ê :exec ':wa\|!ruby %'
    autocmd BufEnter *.rst map <buffer> ê :exec ':wa\|!hovercraft % ' . expand('%:r')
    autocmd BufEnter *.css map <buffer> ê :exec ':wa\|!hovercraft ' . expand('%:r'). '.rst ' . expand('%:r')
" }

" Formatting {
    set showbreak=>\ \ \            " Long line wrap beginning of new line
    set nowrap                      " Don't wrap long lines
    set smartindent                 " Indent at the same level of the previous line
    set shiftwidth=4                " Use indents of 4 spaces
    set expandtab                   " Tabs are spaces, not tabs
    set tabstop=4                   " An indentation every four columns
    set softtabstop=4               " Let backspace delete indent
    set nojoinspaces                " Prevents inserting two spaces after punctuation on a join (J)
    set splitright                  " Puts new vsplit windows to the right of the current
    set splitbelow                  " Puts new split windows to the bottom of the current
    set matchpairs+=<:>             " Match, to be used with %
    set pastetoggle=<F12>           " pastetoggle (sane indentation on pastes)

    set spelllang=en_us,fr

    set columns=80
    set textwidth=80
    set wrapmargin=2
    "set colorcolumn=+1
    "highlight ColorColumn ctermbg=darkgray
" }

" Key (re)Mappings {
    
    "source ~/.vimrc.bepo

    let mapleader = '_'
    nnoremap <Leader>rr :w<CR> :wa\|source ~/.vimrc <CR>

    " Yank from the cursor to the end of the line, to be consistent with C and D.
    nnoremap Y y$

    " Most prefer to toggle search highlighting rather than clear the current
    " search results. To clear search highlighting rather than toggle it on
    " and off, add the following to your .vimrc.before.local file:
    nnoremap <silent> <leader>/ :nohlsearch<CR>

    " For when you forget to sudo.. Really Write the file.
    cmap w!! w !sudo tee % >/dev/null

    """""""""""""""

    " ctags
    nmap <Leader>] 

    " incsearch for “:” and “:s” command
    nmap <Leader>: :OverCommandLine
    nmap <Leader>… :OverCommandLine


    " Sneak {
        " 1-character enhanced 't'
        "nmap j <Plug>Sneak_t
        "nmap J <Plug>Sneak_T
        " visual-mode
        "xmap j <Plug>Sneak_t
        "xmap J <Plug>Sneak_T
        " operator-pending-mode
        "omap j <Plug>Sneak_t
        "omap J <Plug>Sneak_T

        " 1-character enhanced 'f'
        "nmap f <Plug>Sneak_f
        "nmap F <Plug>Sneak_F
        " visual-mode
        "xmap f <Plug>Sneak_f
        "xmap F <Plug>Sneak_F
        " operator-pending-mode
        "omap f <Plug>Sneak_f
        "omap F <Plug>Sneak_F
    " }

" }

" Plugins configuration {
    " vim-cpp-enhanced-highlight"{
        let g:cpp_class_scope_highlight = 1
        let g:cpp_experimental_template_highlight = 1
    " "}

    " UndoTree {
        nnoremap <Leader>u :UndotreeToggle<CR>
        " If undotree is opened, it is likely one wants to interact with it.
        let g:undotree_SetFocusWhenToggle=1
    " }

    " LanguageTool {
        let g:languagetool_jar  = "~/documents/LanguageTool-2.7/languagetool.jar"
        let g:languagetool_lang = 'fr'
    " }

    " vim-headerguard {
        autocmd BufNewFile *h,*.hpp HeaderguardAdd
    " }

    " SnipMate {
        " Setting the author var
        " If forking, please overwrite in your .vimrc.local file
        let g:snips_author = 'Robin Moussu <robin.moussu+vim@gmail.com>'
    " }

    " NerdTree {
        noremap <C-e> <plug>NERDTreeTabsToggle<CR>
        noremap <leader>e :NERDTreeFind<CR>
        nnoremap <leader>nt :NERDTreeFind<CR>

        let NERDTreeShowBookmarks=1
        let NERDTreeIgnore=['\.pyc', '\~$', '\.swo$', '\.swp$', '\.git', '\.hg', '\.svn', '\.bzr']
        let NERDTreeChDirMode=0
        let NERDTreeQuitOnOpen=1
        let NERDTreeMouseMode=2
        let NERDTreeShowHidden=1
        let NERDTreeKeepTreeInNewTab=1
        let g:nerdtree_tabs_open_on_gui_startup=0
    " }

    " Session List {
        set sessionoptions=blank,buffers,curdir,folds,tabpages,winsize
        nnoremap <leader>sl :SessionList<CR>
        nnoremap <leader>ss :SessionSave<CR>
        nnoremap <leader>sc :SessionClose<CR>
    " }

    " TagBar {
        nnoremap <silent> <leader>tt :TagbarToggle<CR>

        " If using go please install the gotags program using the following
        " go install github.com/jstemmer/gotags
        " And make sure gotags is in your path
        let g:tagbar_type_go = {
            \ 'ctagstype' : 'go',
            \ 'kinds'     : [  'p:package', 'i:imports:1', 'c:constants', 'v:variables',
                \ 't:types',  'n:interfaces', 'w:fields', 'e:embedded', 'm:methods',
                \ 'r:constructor', 'f:functions' ],
            \ 'sro' : '.',
            \ 'kind2scope' : { 't' : 'ctype', 'n' : 'ntype' },
            \ 'scope2kind' : { 'ctype' : 't', 'ntype' : 'n' },
            \ 'ctagsbin'  : 'gotags',
            \ 'ctagsargs' : '-sort -silent'
            \ }
    "}

    "" PythonMode {
        "" Disable if python support not present
        "if !has('python')
            "let g:pymode = 0
        "endif
    "" }

    " Fugitive {
        nnoremap <silent> <leader>gs :Gstatus<CR>
        nnoremap <silent> <leader>gd :Gdiff<CR>
        nnoremap <silent> <leader>gc :Gcommit<CR>
        nnoremap <silent> <leader>gb :Gblame<CR>
        nnoremap <silent> <leader>gl :Glog<CR>
        nnoremap <silent> <leader>gp :Git push<CR>
        nnoremap <silent> <leader>gr :Gread<CR>
        nnoremap <silent> <leader>gw :Gwrite<CR>
        nnoremap <silent> <leader>ge :Gedit<CR>
        " Mnemonic _i_nteractive
        nnoremap <silent> <leader>gi :Git add -p %<CR>
        nnoremap <silent> <leader>gg :SignifyToggle<CR>
    "}

    "" YouCompleteMe {
        "let g:acp_enableAtStartup = 0

        "" enable completion from tags
        "let g:ycm_collect_identifiers_from_tags_files = 1

        "" remap Ultisnips for compatibility for YCM
        "let g:UltiSnipsExpandTrigger = '<C-j>'
        "let g:UltiSnipsJumpForwardTrigger = '<C-j>'
        "let g:UltiSnipsJumpBackwardTrigger = '<C-t>'

        "" Enable omni completion.
        "autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
        "autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
        "autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
        "autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
        "autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
        "autocmd FileType ruby setlocal omnifunc=rubycomplete#Complete
        "autocmd FileType haskell setlocal omnifunc=necoghc#omnifunc

        "" Haskell post write lint and check with ghcmod
        "" $ `cabal install ghcmod` if missing and ensure
        "" ~/.cabal/bin is in your $PATH.
        "if !executable("ghcmod")
            "autocmd BufWritePost *.hs GhcModCheckAndLintAsync
        "endif

        "" For snippet_complete marker.
        "if !exists("g:spf13_no_conceal")
            "if has('conceal')
                "set conceallevel=2 concealcursor=i
            "endif
        "endif

        "" Disable the neosnippet preview candidate window
        "" When enabled, there can be too much visual noise
        "" especially when splits are used.
        "set completeopt-=preview
    "" }

    " neocomplete {
        let g:acp_enableAtStartup = 0
        let g:neocomplete#enable_at_startup = 1
        let g:neocomplete#enable_smart_case = 1
        let g:neocomplete#enable_auto_delimiter = 1
        let g:neocomplete#max_list = 15
        let g:neocomplete#force_overwrite_completefunc = 1


        " Define dictionary.
        let g:neocomplete#sources#dictionary#dictionaries = {
                    \ 'default' : '',
                    \ 'vimshell' : $HOME.'/.vimshell_hist',
                    \ 'scheme' : $HOME.'/.gosh_completions'
                    \ }

        " Define keyword.
        if !exists('g:neocomplete#keyword_patterns')
            let g:neocomplete#keyword_patterns = {}
        endif
        let g:neocomplete#keyword_patterns['default'] = '\h\w*'

        " Enable heavy omni completion.
        if !exists('g:neocomplete#sources#omni#input_patterns')
            let g:neocomplete#sources#omni#input_patterns = {}
        endif
        let g:neocomplete#sources#omni#input_patterns.php = '[^. \t]->\h\w*\|\h\w*::'
        let g:neocomplete#sources#omni#input_patterns.perl = '\h\w*->\h\w*\|\h\w*::'
        let g:neocomplete#sources#omni#input_patterns.c = '[^.[:digit:] *\t]\%(\.\|->\)'
        let g:neocomplete#sources#omni#input_patterns.cpp = '[^.[:digit:] *\t]\%(\.\|->\)\|\h\w*::'
        let g:neocomplete#sources#omni#input_patterns.ruby = '[^. *\t]\.\h\w*\|\h\w*::'
    " }

    "" neocomplcache {
        let g:acp_enableAtStartup = 0
        let g:neocomplcache_enable_at_startup = 1
        let g:neocomplcache_enable_camel_case_completion = 1
        let g:neocomplcache_enable_smart_case = 1
        let g:neocomplcache_enable_underbar_completion = 1
        let g:neocomplcache_enable_auto_delimiter = 1
        let g:neocomplcache_max_list = 15
        let g:neocomplcache_force_overwrite_completefunc = 1

        " Define dictionary.
        let g:neocomplcache_dictionary_filetype_lists = {
                    \ 'default' : '',
                    \ 'vimshell' : $HOME.'/.vimshell_hist',
                    \ 'scheme' : $HOME.'/.gosh_completions'
                    \ }

        " Define keyword.
        if !exists('g:neocomplcache_keyword_patterns')
            let g:neocomplcache_keyword_patterns = {}
        endif
        let g:neocomplcache_keyword_patterns._ = '\h\w*'

        "" Plugin key-mappings {
            "" These two lines conflict with the default digraph mapping of <C-K>
            imap – <Plug>(neosnippet_expand_or_jump)
            smap – <Plug>(neosnippet_expand_or_jump)
            "if exists('g:spf13_noninvasive_completion')
                "iunmap <CR>
                "" <ESC> takes you out of insert mode
                "inoremap <expr> <Esc>   pumvisible() ? "\<C-y>\<Esc>" : "\<Esc>"
                "" <CR> accepts first, then sends the <CR>
                "inoremap <expr> <CR>    pumvisible() ? "\<C-y>\<CR>" : "\<CR>"
                "" <Down> and <Up> cycle like <Tab> and <S-Tab>
                "inoremap <expr> <Down>  pumvisible() ? "\<C-n>" : "\<Down>"
                "inoremap <expr> <Up>    pumvisible() ? "\<C-p>" : "\<Up>"
                "" Jump up and down the list
                "inoremap <expr> <C-d>   pumvisible() ? "\<PageDown>\<C-p>\<C-n>" : "\<C-d>"
                "inoremap <expr> <C-u>   pumvisible() ? "\<PageUp>\<C-p>\<C-n>" : "\<C-u>"
            "else
                "imap <silent><expr><C-k> neosnippet#expandable() ?
                            "\ "\<Plug>(neosnippet_expand_or_jump)" : (pumvisible() ?
                            "\ "\<C-e>" : "\<Plug>(neosnippet_expand_or_jump)")
                "smap <TAB> <Right><Plug>(neosnippet_jump_or_expand)

                "inoremap <expr><C-g> neocomplcache#undo_completion()
                "inoremap <expr><C-l> neocomplcache#complete_common_string()
                "inoremap <expr><CR> neocomplcache#complete_common_string()

                "" <CR>: close popup
                "" <s-CR>: close popup and save indent.
                "inoremap <expr><s-CR> pumvisible() ? neocomplcache#close_popup()"\<CR>" : "\<CR>"
                "inoremap <expr><CR> pumvisible() ? neocomplcache#close_popup() : "\<CR>"

                "" <C-h>, <BS>: close popup and delete backword char.
                "inoremap <expr><BS> neocomplcache#smart_close_popup()."\<C-h>"
                "inoremap <expr><C-y> neocomplcache#close_popup()
            "endif
            "" <TAB>: completion.
            "inoremap <expr><TAB> pumvisible() ? "\<C-n>" : "\<TAB>"
            "inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<TAB>"
        "" }

        " Enable omni completion.
        autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
        autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
        autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
        autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
        autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
        autocmd FileType ruby setlocal omnifunc=rubycomplete#Complete
        autocmd FileType haskell setlocal omnifunc=necoghc#omnifunc

        " Enable heavy omni completion.
        if !exists('g:neocomplcache_omni_patterns')
            let g:neocomplcache_omni_patterns = {}
        endif
        let g:neocomplcache_omni_patterns.php = '[^. \t]->\h\w*\|\h\w*::'
        let g:neocomplcache_omni_patterns.perl = '\h\w*->\h\w*\|\h\w*::'
        let g:neocomplcache_omni_patterns.c = '[^.[:digit:] *\t]\%(\.\|->\)'
        let g:neocomplcache_omni_patterns.cpp = '[^.[:digit:] *\t]\%(\.\|->\)\|\h\w*::'
        let g:neocomplcache_omni_patterns.ruby = '[^. *\t]\.\h\w*\|\h\w*::'
" }

"" Normal Vim omni-completion {
"" To disable omni complete, add the following to your .vimrc.before.local file:
""   let g:spf13_no_omni_complete = 1
    ""elseif !exists('g:spf13_no_omni_complete')
        "" Enable omni-completion.
        "autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
        "autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
        "autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
        "autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
        "autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
        "autocmd FileType ruby setlocal omnifunc=rubycomplete#Complete
        "autocmd FileType haskell setlocal omnifunc=necoghc#omnifunc
    "" }

    " Snippets {
        " Use honza's snippets.
        let g:neosnippet#snippets_directory='~/.vim/bundle/vim-snippets/snippets'

        " Enable neosnippet snipmate compatibility mode
        let g:neosnippet#enable_snipmate_compatibility = 1

        " For snippet_complete marker.
        if !exists("g:spf13_no_conceal")
            if has('conceal')
                set conceallevel=2 concealcursor=i
            endif
        endif

        " Disable the neosnippet preview candidate window
        " When enabled, there can be too much visual noise
        " especially when splits are used.
        set completeopt-=preview
    " }

    " vim-airline {
        " Set configuration options for the statusline plugin vim-airline.
        " Use the powerline theme and optionally enable powerline symbols.
        " To use the symbols , , , , , , and .in the statusline
        " segments add the following to your .vimrc.before.local file:
        "   let g:airline_powerline_fonts=1
        " If the previous symbols do not render for you then install a
        " powerline enabled font.

        " See `:echo g:airline_theme_map` for some more choices
        " Default in terminal vim is 'dark'
        if !exists('g:airline_theme')
            let g:airline_theme = 'badwolf'
        endif
        if !exists('g:airline_powerline_fonts')
            " Use the default set of separators with a few customizations
"            let g:airline_left_sep='›'  " Slightly fancier than '>'
"            let g:airline_right_sep='‹' " Slightly fancier than '<'
        endif
        let g:airline_section_c = '%t'
        let g:airline_left_sep = '▶'
        let g:airline_right_sep = '◀'
    " }

    " Whitespace {
        let g:whitespaste_before_mapping = 'P'
        let g:whitespaste_after_mapping  = 'p'

        let g:whitespaste_linewise_definitions = {
            \   'top': [
            \     { 'target_text': '{\s*$', 'blank_lines': 0 }
            \   ],
            \   'bottom': [
            \     { 'target_text': '^}$', 'blank_lines': 0 }
            \   ]
            \ }
    " }
" }

" to fix
"unmap ;bc

"call Custom_key_on()
