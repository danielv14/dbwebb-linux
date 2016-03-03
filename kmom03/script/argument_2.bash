#!/bin/bash
if [ "$1" == "d" ]
then
	echo Today is: "$(date)"
elif [ "$1" == "n" ]
then
	echo {1..20}
elif [ "$1" == "a" ] && [ $# -gt 1 ]
then
	echo "$2"
else
	echo Missing argument
fi
