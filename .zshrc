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
alias tyls='tyls -m'
# marre de se faire corriger par zsh ;)
alias xs='cd'
alias sl='ls'
# mplayer en plein framme buffer ;)
alias mplayerfb='mplayer -vo fbdev -vf scale=1024:768'
# Un grep avec des couleurs :
export GREP_COLOR=31
alias grep='grep --color=auto'
alias gitdate='git commit -am "$(date)"; git push'
# vim
alias nv='nvim'

function lless() {
    unalias less
    if test -t 1; then
        pygmentize 2>/dev/null -g "$@" | \less
    else
        less "$@"
    fi
    alias less='lless'
}
alias less='lless'

function ccat() {
    if test -t 1; then
        pygmentize 2>/dev/null -g "$@"
    else
        unalias cat
        cat "$@"
        alias cat='ccat'
    fi
}
alias cat='ccat'


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
export LESS=-R

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
alias te="setxkbmap -layout \"perso(bepo_te)\""
alias qsdf="setxkbmap -layout \"perso(bepo_perso)\""
alias asdf="setxkbmap -layout \"perso(bepo_perso)\""
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
   alias vpnc='sudo vpnc'
fi

alias -g ¿='| xclip -selection clipboard'

if [ $USER = "robin" ] ;  then

    #clavier
    alias rmfr="sudo rm /var/lib/xkb/*"
    alias vimfr="sudo vim /usr/share/X11/xkb/symbols/perso"
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

if [ $UID = 0 ]; then
    Separator_Color="${BGreen}"
    Text_color=${URed}
else
    Separator_Color="${PBlack}"
    Text_color=${PYellow}
fi
Separator_Left="${Separator_Color}(${Text_color}"
Separator_Right="${Separator_Color})${Text_color}"
Separator_Center="${Separator_Color}–${Text_color}"

function ps1_elem() {
    echo -E "${Separator_Left}${Text_color}$*${Separator_Right}"
}

function ps1_pwd() {
    pwd | sed -e "s-${HOME}-~-" -e "s-~/documents/cour-cour-"
}

function ps1_git_branch() {

    git_color=${Green}
    if [[ ! "$(LANG=C; git status 2> /dev/null)" =~ "working directory clean" ]]; then
        git_color=${Purple}
    fi
    if [[ -n "$(git diff 2> /dev/null)" ]]; then
        git_color=${Red}
    fi
    git_msg=$(git rev-parse --abbrev-ref HEAD 2> /dev/null || echo '✘')

    echo -E "${git_color}${git_msg}${Text_color}"
}

function ps1_host() {
    echo -E "${HOST}"
}

function ps1_text_color() {
    echo -E "${Color_Off}"
}

function ps1_git_home() {
    (git rev-parse --show-toplevel | sed -e "s-$(pwd)-✔-g" -e "s-${HOME}-~-" | rev | cut -d / -f 1 | rev) 2>/dev/null
}

precmd function prompt() {
    PS1=$(echo -e $(printf "%s%s%s%s%s" \
        "${Separator_Color}┌$(ps1_elem $(ps1_pwd))" \
        "${Separator_Center}$(ps1_elem $(ps1_git_home)${Separator_Color}:${Text_color}$(ps1_git_branch))" \
        "${Separator_Center}$(ps1_elem $(ps1_host))" \
        "\n${Separator_Color}└┤" \
        "$(ps1_text_color)" \
        ) )
}

PS1=$(prompt)

function :e() {
    [ -r ~/.signet/save$1 ] && cd "$(cat ~/.signet/save$1)" || echo >&2 "Le signet $1 n'existe pas"
}

function :w() {
    pwd > ~/.signet/save$1 > ~/.signet/save
}

function :q() {
    exit
}

function :wq() {
    :w
    :q
}

source ~/.zsh/completion/_:e

### Projet GL
#PATH=$PATH:$HOME/doc/cour/gl/4MMPGL/bin:$PATH
##PATH=$PATH:$HOME/doc/cour/gl/Projet_GL/src/main/bin:$PATH
#PATH=$PATH:$HOME/doc/cour/gl/integration/src/main/bin:$PATH
#PATH=$PATH:/home/robin/.gem/ruby/**/bin
#PATH=$PATH:/home/robin/doc/cour/gl/Projet_GL/src/test/deca/context/invalid/provided
#export PATH
#source /usr/share/cdargs/cdargs-bash.sh 2>/dev/null 1>/dev/null
#
#function exec_test() {
#
#    function success() {
#        mpv ~/Music/bruitage/cowbell_sf.mp3 ~/Music/bruitage/cowbell_sf.mp3 2>/dev/null 1>/dev/null
#    }
#
#    function faillure() {
#        mpv ~/Music/bruitage/SF-dive.mp3 ~/Music/bruitage/SF-dive.mp3 2>/dev/null 1>/dev/null
#    }
#
#    mvn clean
#    mvn test -Dmaven.test.failure.ignore && success || faillure
#}

#ponysay << EOF
#Coucou,
           #___     ___   ____   o
           #¶  \   /   \  |   \     |\  |      |
           #¶__/   |   |  |___/  §  | \ |      |
           #¶  \   |   |  |   \  §  |  \|      |
           #¶   \  \___/  |___/  §  |   |      o
#EOF


#estrell

#export LUSTRE_INSTALL=~/doc/cour/modèle_du_temps_et_du_parallélisme/lustre-v4-III-c-linux64
#source $LUSTRE_INSTALL/setenv.sh

mkcd() {
    mkdir $1
    cd $1
}

export PATH="$PATH:/home/robin/.gem/ruby/2.2.0/bin"
