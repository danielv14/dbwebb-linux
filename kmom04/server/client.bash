#!/bin/bash
#client.bash

if [ "$1" == "hello" ]
then
    curl http://127.0.0.1:1337/

elif [ "$1" == "html" ]
then
    curl http://127.0.0.1:1337/index.html

elif [ "$1" == "status" ]
then
    curl http://127.0.0.1:1337/status

elif [ "$1" == "help" ]
  then
      echo 'You can type ./client.bash [OPTION] with the following options:'
      echo 'hello'
      echo 'html'
      echo 'status'
      echo 'filter (followed by numbers) for example filter 2 24 50'
      echo 'sum (followed by numbers) for example sum 3 5 4'
      echo 'all'

elif [[ "$1" == "sum" || "$1" == "filter" ]] && [ "$#" -gt 1 ]
then
    adress="http://127.0.0.1:1337/"
    arguments=$#
    count=1

    for i in "$@"
    do
        if [ "$count" -eq "1" ]
        then
            adress+="$i?"
        elif [ "$count" -lt "$arguments" ]
        then
            adress+="$i&"
        else
            adress+="$i"
        fi
        (( count++ ))
    done
    curl "$adress"

elif [ "$1" == "404" ]
then
    curl -I http://127.0.0.1:1337/404

elif [ "$1" == "all" ]
then
    echo "You have chosen to run all the commands. The commands are as follow:"
    echo "====================================================================="
    echo "Commando: '~$ ./client.bash hello' yields:"
    ./client.bash hello

    echo "Commando: '~$ ./client.bash html' yields: "
    ./client.bash html

    echo "Commando: '~$ ./client.bash status' yields: "
    ./client.bash status
    echo ""

    echo "Commando: '~$./client.bash sum 2 3 4' yields: "
    ./client.bash sum 2 3 4
    echo ""

    echo "Commando: '~$ ./client.bash filter 2 3 45 4' yields: "
    ./client.bash filter 2 3 45 4
    echo ""

    echo "Commando: '~$ ./client.bash 404' yields: "
    ./client.bash 404

    echo '======================================='
    echo 'That was all of them!'

else
    echo "I'm sorry. That command is not valid. try passing 'help'"
fi
