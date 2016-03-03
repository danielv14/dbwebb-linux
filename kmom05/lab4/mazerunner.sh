#!/bin/bash


# function to initialize
function init {
  echo "init server"
  curl localhost:1337/?type=csv
}

# Function for showing the maps
function maps {
  echo "1. maze-of-doom.json"
  echo "2. small-maze.json"
  echo
  echo "use mazerunner select # to choose map"
  curl localhost:1337/map?type=csv #>/dev/null 2>&1
}

# Function for map 1
function map1 {
  echo "Maze of doom selected. Have fun!"
  curl localhost:1337/:gameid/map/maze-of-doom.json?type=csv #>/dev/null 2>&1
}

# Function for map 2
function map2 {
  echo "Small maze selected. Have fun!"
  curl localhost:1337/:gameid/map/small-maze.json?type=csv #>/dev/null 2>&1
}

# function for entering the maze
function enter {
  curl localhost:1337/:gameid/maze/0?type=csv
  echo 'entering first room'
}

# Funcion for going north
function goNorth {
  echo 'placeholder for going north'
  curl localhost:1337/:gameid/maze/:roomId/north?type=csv && echo
}

#function for going south
function goSouth {
  echo 'placeholder for going south'
  curl localhost:1337/:gameid/maze/:roomid/south?type=csv && echo
}

#function for going west
function goWest {
  echo 'placeholder for going west'
  curl localhost:1337/:gameid/maze/:roomId/west?type=csv && echo
}

#function for going east
function goEast {
  echo 'placeholder for going east'
  curl localhost:1337/:gameid/maze/:roomId/east?type=csv && echo
}

if [ "$1" == "init" ]
then
  init

elif [ "$1" == "maps" ]
then
  maps

elif [ "$1" == "select" ]
then
  if [ "$2" == "1" ]
  then
    map1
  elif [ "$2" == "2" ]
  then
    map2
  fi

elif [ "$1" == "enter" ]
then
  enter

elif [ "$1" == "go" ]
then
  if [ "$2" == "north" ]
  then
    goNorth
  elif [ "$2" == "south" ]
  then
    goSouth
  elif [ "$2" == "west" ]
  then
    goWest
  elif [ "$2" == "east" ]
  then
    goEast
  else
    echo 'not a valid command'
  fi
fi
