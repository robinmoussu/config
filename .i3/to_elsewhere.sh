#/bin/bash

pidfile="$HOME/.i3/.pid"
initval=10
maxval=20

[ -f "$pidfile" ] && nb=$(cat "$pidfile")
# on supprime le fichier si le pid est trop grand, trop petit, ou s'il
# n'est pas un nombre
[ $nb -gt $initval ] && [ $nb -lt $maxval ] || rm "$pidfile"

# creation du fichier de pid si necessaire
[ -f "$pidfile" ] || echo $initval > "$pidfile"

wk=$(echo $(cat "$pidfile") + 1 | bc | tee "$pidfile")
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "focus parent"
i3-msg "move container to workspace $wk ; workspace $wk"
