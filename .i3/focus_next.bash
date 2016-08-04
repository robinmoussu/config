#!/bin/bash

id=$(python ~/.i3/id_next.py)
i3-msg [id="$id"] focus > /dev/null
