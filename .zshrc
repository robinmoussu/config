#!/usr/bin/env zsh
#   _________  _   _ ____   ____ 
#  |__  / ___|| | | |  _ \ / ___|
#    / /\___ \| |_| | |_) | |    
# _ / /_ ___) |  _  |  _ <| |___ 
#(_)____|____/|_| |_|_| \_\\____|
#

# Complétion 
autoload -U compinit
compinit -C
zstyle ':completion:*:descriptions' format '%U%B%d%b%u'
zstyle ':completion:*:warnings' format '%BSorry, no matches for: %d%b'
zstyle ':completion:*:sudo:*' command-path /usr/local/sbin /usr/local/bin \
   /usr/sbin /usr/bin /sbin /bin /usr/X11R6/bin
# case-insensitive (all),partial-word and then substring completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' \
   'r:|[._-]=* r:|=*' 'l:|=* r:|=*'
# Crée un cache des complétion possibles
# très utile pour les complétion qui demandent beaucoup de temps
# comme la recherche d'un paquet aptitude install moz<tab>
zstyle ':completion:*' use-cache on
zstyle ':completion:*' cache-path ~/.zsh_cache
# des couleurs pour la complétion
# faites un kill -9 <tab><tab> pour voir :)
zmodload zsh/complist
setopt extendedglob
zstyle ':completion:*:*:kill:*:processes' list-colors "=(#b) #([0-9]#)*=36=31"

# Correction des commandes
setopt correctall

#coloration syntaxique
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Les alias marchent comme sous bash
alias ls='ls --color=auto'
alias la='ls -a'
alias lla='ls -la'
alias ll='ls --color=auto -lh'
alias lll='ls --color=auto -lh | less'
# marre de se faire corriger par zsh ;)
alias xs='cd'
alias sl='ls'
# mplayer en plein framme buffer ;)
alias mplayerfb='mplayer -vo fbdev -vf scale=1024:768'
# Un grep avec des couleurs :
export GREP_COLOR=31
alias grep='grep --color=auto'

alias -s pdf=zathura

# Pareil pour les variables d'environement :
#export http_proxy="http://hostname:8080/"
#export HTTP_PROXY=$http_proxy
# un VRAI éditeur de texte ;)
export EDITOR=/usr/bin/vim

alias smount="source /home/common/smount.sh"
#alias t='~/.t/t.py --task-dir ~/tasks --list tasks'

#mode vim
bindkey -v

bindkey '^P' up-history
bindkey '^N' down-history
bindkey '^?' backward-delete-char
bindkey '^h' backward-delete-char
bindkey '^w' backward-kill-word
bindkey '^r' history-incremental-search-backward

#function zle-line-init zle-keymap-select {
#VIM_PROMPT="%{$fg_bold[yellow]%} [% NORMAL]%  %{$reset_color%}"
#RPS1="${${KEYMAP/vicmd/$VIM_PROMPT}/(main|viins)/}$(git_custom_status) $EPS1"
#zle reset-prompt
#}

#zle -N zle-line-init
#zle -N zle-keymap-select
#export KEYTIMEOUT=1

#historique
export HISTFILE=~/.zsh_history
export HISTSIZE=5000
export SAVEHIST=5000

#less
export LESS=-r

# Un petit prompt sympa
#autoload -U promptinit
#promptinit

#ponysay $(fortune)

alias :q="exit"
alias :wq="exit"

#programmes divers
alias o="xdg-open"
alias m="mplayer"
alias calcurse="LC_ALL=utf8 calcurse"
alias i3-error="less /run/user/robin/i3/errorlog.5959 "
[[ -x /bin/vimx ]] && alias vim='vimx'
alias view='vim +"set ro" +"setlocal nomodifiable"'

#mapping clavier
alias auie="setxkbmap -layout \"fr\""
alias qsdf="setxkbmap -layout \"fr(bepo_number)\""
alias asdf="setxkbmap -layout \"fr(bepo_number)\""
alias bepo="setxkbmap -layout \"fr(bepo)\""
alias azer="setxkbmap -layout \"fr(bepo)\""

#micelanous
#alias java="java -cp . "
#alias javac="javac -cp . "
alias gcc="gcc  -fdiagnostics-color "
export LANG=fr_FR.UTF-8

# les commandes spécifiques à root et aux users
if [ $UID = 0 ]; then
   #prompt fire

   # pour arduino serial usb
   #[ ! -f "/dev/ttyUSB0" ] ||  ln -s /dev/ttyACM0 /dev/ttyUSB0
   #chmod 777 /run/lock

else
   #prompt fade
   alias pacman='sudo pacman'
   alias vpnc='sudo vpnc'
fi

if [ $USER = "robin" ] ;  then

    #raccourcis
    alias -g _win=/mnt/win/
    alias -g _doc=/home/robin/Document
    alias -g _git=/home/robin/Document/git/
    alias -g _svn=/home/robin/svn/
    alias -g _music=/home/robin/Musique/
    alias -g _videos=/mnt/documents/Videos/
    alias -g _img=/home/robin/Images/
    alias -g _cour=/home/robin/cour/1ere_annee_phelma/
    alias -g _robotronik=/home/robin_arch/svn/robotronik/

    alias get_ip="wget http://ipecho.net/plain -O - -q  >>! ~/.last_ip.txt && echo '' >>! ~/.last_ip.txt;tail -n 1 ~/.last_ip.txt"
    alias sshpi='ssh robin@`tail -n 1 ~/.last_ip.txt`'


    #clavier
    alias rmfr="sudo rm /var/lib/xkb/*"
    alias vimfr="sudo vim /usr/share/X11/xkb/symbols/fr"
    alias cpfr="sudo cp /usr/share/X11/xkb/symbols/fr /home/robin/bépo/svg_fr/xkb_\`date +%d-%m-%y-%Hh%M\`"
    alias lessfr=" less /usr/include/X11/keysymdef.h "
    alias compfr="xkbcomp /usr/share/X11/xkb/symbols/fr"
    alias cdfr="cd /usr/share/X11/xkb/symbols/"
    alias conffr="vim ~/bépo/dispo_perso"
    alias frfr="cpfr ; compfr && rmfr ; setxkbmap -layout \"fr(jeop_actual)\"  "
    alias Xfr="vim ~/.XCompose && cp ~/.XCompose /home/robin/bépo/svg_fr/XCompose_\`date +%d-%m-%y-%Hh%M\`"

    #if ps -u robin | grep xcape > /dev/null  ; then 
    #else
        # utilisation d'espace comme maj
        #spare_modifier="Hyper_L"
        #xmodmap -e "keycode  65 = $spare_modifier"
        #xmodmap -e "remove mod4 = $spare_modifier"
        #xmodmap -e "add   Shift = $spare_modifier"
        #xmodmap -e "keycode 152 = space"

        #xcape -e 'Hyper_L=space;ISO_Level3_Shift=Escape'
        ##xcape -e 'ISO_Level5_Latch=r;ISO_Level5_Shift=comma'
    #fi

    [[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && exec startx

fi

#screen -x -R
#if  screen -ls | grep Attached > /dev/null ; then 
    #echo 1
    #screen -x -a #> /dev/null
#elif  screen -ls | grep Detached > /dev/null ; then 
    #screen -R -a
    #echo 2
#else
    #screen -a
    #echo 3
#fi

#twget -q -O - checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//''>'
# curl -s checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//'>'

# blkid

#source /etc/udisks_functions/udisks_functions

source ~/.color.sh

function init_color() {
    if [ $UID = 0 ]; then
        Separator_Color="${BGreen}"
        Text_color=${URed}
    else
        Separator_Color="${PBlack}"
        Text_color=${PYellow}
    fi
    Separator_Left="${Separator_Color}("
    Separator_Right="${Separator_Color})"
    Separator_Center="${Separator_Color}–"
    Prompt="${Separator_Color}┤"
}

function prompt_left() {
    echo -E "${Separator_Left}${Text_color}$(pwd | sed -e "s-${HOME}-~-" -e "s-~/documents/cour-cour-" )${Separator_Right}"
}

function prompt_center() {

    git_color=${Green}
    if [[ ! "$(LANG=C; git status 2> /dev/null)" =~ "working directory clean" ]]; then
        git_color=${Orange}
    fi
    if [[ -n "$(git diff 2> /dev/null)" ]]; then
        git_color=${Red}
    fi
    git_msg=$(git rev-parse --abbrev-ref HEAD 2> /dev/null || echo '✘')

    echo -E "${Separator_Left}${git_color}${git_msg}${Separator_Right}"
}

function prompt_right() {
    echo -E "${Separator_Left}${Text_color}${HOST}${Separator_Right}"
}

function prompt_second_line() {
    echo -E "${Prompt}"
}

function text_color() {
    echo -E "${Color_Off}"
}

function lenght_visible() {
    echo -E $(${1}) | sed -e 's-\\e\[[0-9];[0-9]\{2\}m--g' -e 's/%{//g' -e 's/%}//g' | wc -m
}

function center() {

    size="0"
    size+=" + $(lenght_visible 'prompt_left'  )"
    size+=" + $(lenght_visible 'prompt_center')"
    size+=" + $(lenght_visible 'prompt_right' )"

    size="($(tput cols) - (${size})) /2"
    size+=" +1"

    space=""
    for ((i=0;i<${size};i++)); do
        space+="{Separator_Center}"
    done
    echo "${space}"
}

precmd function prompt() {
    init_color
    PS1=$(echo -e $(printf "%s%s%s%s%s" \
        "${Separator_Color}┌$(prompt_left)" \
        "${Separator_Center}$(prompt_center)" \
        "${Separator_Center}$(prompt_right)" \
        "\n${Separator_Color}└$(prompt_second_line)" \
        "$(text_color)" \
        ) )
}

PS1=$(prompt)

function ccd() {
    cd "$(cat ~/.ccd/save$1)" && clear
}

function x() {
    pwd > ~/.ccd/save$1
}

## Projet GL
PATH=$PATH:$HOME/doc/cour/gl/4MMPGL/bin:$PATH
export PATH
