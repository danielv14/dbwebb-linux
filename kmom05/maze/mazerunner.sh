#!/bin/bash
#
#
# Exit values:
#  0 on success
#  1 on failure
#


# Name of the script
SCRIPT=$( basename "$0" )
# Current version
VERSION="1.2"

#
# Message to display for usage and help.
#
function usage
{
    local txt=(
"Usage: $SCRIPT [options] <command> [arguments]"
"Available Commands are:"
"  init            Start new mazerunner game"
"  maps            Show the available maps to play"
"  select <map>    Select a map you want to play"
"  enter           Enter the maze"
"  go <direction>  Navigate the maze"
"  loop            Start a gameloop"
"Available Options are:"
"  --version, -h  Print version."
"  --help, -h     Print help."
    )

    printf "%s\n" "${txt[@]}"
}



#
# Message to display when bad usage.
#
function badUsage
{
    local message="$1"
    local txt=(
"See all the different commands by executing:"
"$SCRIPT --help"
    )

    [[ $message ]] && printf "$message\n"

    printf "%s\n" "${txt[@]}"
}



#
# Message to display for version.
#
function version
{
    local txt=(
"$SCRIPT version $VERSION"
    )

    printf "%s\n" "${txt[@]}"
}

# Function for initializing the game
function initGame
{
  op="$(curl --silent localhost:1337/?type=csv)"
  echo "${op}" > initGame.txt
  op2="$(tail -1 initGame.txt)"
  IFS=', ' read -a array <<< "${op2}"
  echo "${array[3]}" > gameNumber.txt
  echo "New game initialized!"
  echo
}

# Function for displaying all the maps
function displayMaps
{
  op="$(curl --silent localhost:1337/map?type=csv)"
  echo "${op}" > gameMaps.txt
  op2="$(tail -1 gameMaps.txt)"
  IFS=', ' read -a array <<< "${op2}"
  echo "Choose one of these maps:"
  echo "1. ${array[0]}"
  echo "2. ${array[1]}"
  echo "type 'mazerunner select #' to choose map."


}

function displayMapsForLoop
{
  op="$(curl --silent localhost:1337/map?type=csv)"
  echo "${op}" > gameMaps.txt
  op2="$(tail -1 gameMaps.txt)"
  IFS=', ' read -a array <<< "${op2}"
  echo "Choose one of these maps:"
  echo "1. ${array[0]}"
  echo "2. ${array[1]}"
}
# Function for displaying the chosen / current map
function displayChosenMap {
  game="$(cat gameNumber.txt)"
  map="$(cat chosenMap.txt)"
  curl --silent localhost:1337/$game/map/$map?type=csv >/dev/null 2>&1
  echo
  echo "You have chosen: ${map} "

}
# Function for selecting one of the maps
function chooseMap
{
  op="$(curl --silent localhost:1337/map?type=csv)"
  echo "${op}" > gameMaps.txt
  op2="$(tail -1 gameMaps.txt)"
  IFS=', ' read -a array <<< "${op2}"

  if [ "$1" = "1" ]; then
      echo "${array[0]}" > chosenMap.txt
      displayChosenMap
      break
  fi

  if [ "$1" = "2" ]; then
      echo "${array[1]}" > chosenMap.txt
      displayChosenMap
      break
  fi

  echo "That is not a valid map choise!"
  break

}

# Function for the active room
function theRoom
{
  game="$(cat gameNumber.txt)"
  map="$(cat chosenMap.txt)"
  op2="$(tail -1 activeRoom.txt)"
  IFS=',' read -a array <<< "${op2}"
  echo "${array[0]}" > roomID.txt
  echo
  echo "Room ID: ${array[0]}"
  echo "Discription:"
  echo "${array[1]} "
  echo "You can go in to the following rooms:"
  echo "West: ${array[2]} or East: ${array[3]} or South: ${array[4]} or North: ${array[5]}"
}

# Function for navigation
function navigateGame
{
  game="$(cat gameNumber.txt)"
  map="$(cat chosenMap.txt)"
  id="$(cat roomID.txt)"

  op2="$(tail -1 activeRoom.txt)"
  IFS=',' read -a array <<< "${op2}"

  echo "$1"

      if [ "$1" = "west" ]; then
          if [ "${array[2]}" = "-" ]; then
            echo "Cannot go west from here. Try another way"
            break
          fi
          curl --silent localhost:1337/$game/maze/$id/west?type=csv > activeRoom.txt
          echo "Moving forward"
          theRoom
          break
      fi

      if [ "$1" = "east" ]; then
          if [ "${array[3]}" = "-" ]; then
            echo "Cannot go east from here. Try another way."
            break
          fi

          curl --silent localhost:1337/$game/maze/$id/east?type=csv > activeRoom.txt
          echo "Moving forward"
          theRoom
          break
      fi

      if [ "$1" = "south" ]; then
          if [ "${array[4]}" = "-" ]; then
            echo "Cannot go south from here. Try another way."
            break
          fi

          curl --silent localhost:1337/$game/maze/$id/south?type=csv > activeRoom.txt
          echo "Moving forward"
          theRoom
          break
      fi

      if [ "$1" = "north" ]; then
          if [ "${array[5]}" = "-" ]; then
            echo "Cannot go north from here. Try another way."
            break
          fi

          curl --silent localhost:1337/$game/maze/$id/north?type=csv > activeRoom.txt
          echo "Moving forward"
          echo
          theRoom
          break
      fi
      echo "That is not a valid direction!"


}

# Function for a navigation loop
function navigationLoop
{

 theRoom

  while true; do
      echo
      read -p "Where do you want to go next? Type the direction: " userInput
      case $userInput in
          [q]* ) echo "Exiting..." && exit 0;;
          [u]* ) usage;;
          [w]* ) navigateGame west;;
          [e]* ) navigateGame east;;
          [s]* ) navigateGame south;;
          [n]* ) navigateGame north;;

          * ) echo; echo "Type either: 'n' for north, 'w' for west, 's' for south or 'e' for east"; echo; echo "Else you can type 'q' for quit or 'u' for usage";;
      esac
 done

 navigationLoop

}

# Function for the starting loop
function startLoop
{
  initGame
  displayMapsForLoop

  while true; do
      echo
      read -p "Choose a map. type 1 or 2: " userInput
      case $userInput in
          [q]* )  echo "Exiting..." && exit 0;;
          [u]* ) usage;;
          [1]* ) echo "Entering first room. Good luck!" && chooseMap 1;;
          [2]* ) echo "Entering first room. Good luck!" && chooseMap 2;;

          * ) echo "Please answer 1 or 2."; echo "Type 'q' to quit or 'u' for tips on commands";;
      esac
 done

 game="$(cat gameNumber.txt)"
 op="$(curl --silent localhost:1337/$game/maze?type=csv)"
 echo "${op}" > activeRoom.txt

 navigationLoop


}

while (( $# ))
do
    case "$1" in

        --help | -h)
            usage
            exit 0
        ;;
        --version | -v)
            version
            exit 0
        ;;
        init)
            initGame
            exit 0
        ;;
        maps)
            displayMaps
            exit 0
        ;;
        select)
            chooseMap $2
            exit 0
        ;;
        enter)
            game="$(cat gameNumber.txt)"
            op="$(curl --silent localhost:1337/$game/maze?type=csv)"
            echo "${op}" > activeRoom.txt
            echo "Entering the first room. Good luck!"
            theRoom
            exit 0
        ;;
        go)
            navigateGame $2
            exit 0
        ;;
        loop)
            startLoop
            exit 0
        ;;
        *)
            badUsage "Not a valid input..."
            exit 1
        ;;

    esac
done
