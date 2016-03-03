#!/bin/bash

if [ "$1" -gt 5 ]
then
	echo Lower!
elif [ "$1" -lt 5 ]
then
	echo Higher!
else
	echo Same!
fi
