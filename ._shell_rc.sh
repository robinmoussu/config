alias auie='setxkbmap fr'
alias qsdf='setxkbmap fr bepo'

alias ll='ls -l'
alias lla='ls -la'

alias watch='watch --color'
alias zathura='zathura --fork'
alias emacs='emacs -nw'
alias sl='ls'

export VISUAL=/usr/bin/vim
export LC_ALL='fr_FR.UTF-8'

export LESS='-r'
export LESSOPEN='|~/.lessfilter %s'


function _fork() {
    $(nohup 2>/dev/null 1>/dev/null $* &)
}

function mkcd() {
    mkdir "$1" -p && cd "$1"
}

function create_dir() {
    if [ $# -ne 1 ]
    then
        echo "usage: create_dir DIRECTORY"
        exit 1
    fi

    name="$1"
    i=0
    while [[ -e "$name-$i" ]] ; do
        let i++
    done
    name="$name-$i"
    mkdir "$name" -p
    echo "$name"
}

function get_res_dir() {
    name=res
    [ -n "$1" ] && name="$1/$name"

    i=0
    while [[ -e "$name-$i" ]] ; do
        let i++
    done
    i=$((i-1))
    if [ "$i" -eq "-1" ]; then echo >&2 "Pas de dossier de résultat trouvé"; return 1; fi
    name="$name-$i"
    echo $name
}

function ccat() {
    local BS=$(( $(stty size | cut -d' ' -f2) - 20 ))     # buffer size
    for FILENAME in $*
    do
        local L=$(( ( $BS - ${#FILENAME} ) / 2 ))
        [ $L -lt 0 ] && L=0
        printf "\n––––––––––%${L}s%s%${L}s––––––––––\n\n" "" $FILENAME ""
        pygmentize -g 2>/dev/null "$FILENAME" 
    done |cat | less -L
}

function hl() { grep --color -E "$1|$" ${@:2}; }

# recursivly search using find from the current dir to /
# syntax [ -exit ] [start_path] find_args ...
# if -exit is used, it stop at the first successful search
# start_path will generaly be .
function rfind() {
    local ret=1

    local force_exit=false
    [[ $1 = -exit ]] && force_exit=true && shift

    local path='.'
    [[ ! "$1" =~ -.* ]] && path=$1 && shift

    while [[ "$path" != "/" ]]
    do
        x=$(find "$path"  -maxdepth 1 -mindepth 1 "$@")
        [ -n "$x" ] && echo "$x" && ret=0 && [ $force_exit = true ] && return 0
        # Note: if you want to ignore symlinks, use "$(realpath -s $path/..)"
        path="$(readlink -f $path/..)"
    done
    return $ret
}

function rsbmake() {
    rfind -exit . -iname makefile -exec bash -c 'cd "$(dirname {})" && sbmake '"$*" \;
}

function ag_() {
    /home/mblot/bin/bin/ag/bin/ag $@ --color --break -H | sed 's/[[:blank:]][[:blank:]]\+/ /g'
}

function print_fct() {
    local function_name="$1"; shift
    local filename="$@"

    local debut_fct="^[a-zA-Z0-9_ ]*$function_name *([^;]*\s*$"
    local fin_fct="^}\s*$"
    sed $filename -n -e "/$debut_fct/, /$fin_fct/p" -s
}

[ -f ~/._shell_rc.local.sh ] && source ~/._shell_rc.local.sh
