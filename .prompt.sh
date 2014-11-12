
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
    echo -E "${Separator_Left}${Text_color}$(git rev-parse --abbrev-ref HEAD 2> /dev/null || echo '✘')${Separator_Right}"
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

