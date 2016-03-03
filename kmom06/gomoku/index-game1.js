#!/usr/bin/env babel-node
/**
 * Main program for the a game of Gomoku.
 */
import GomokuBoard from "./GomokuBoard.js";


const VERSION = "1.0.0";

// For CLI usage
var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;
var num = 20;
var xpos, ypos;

if (args[0] > 2){num = args[0];}

/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.`);
}



/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}


while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        default:
            break;
    }
}



var size = num,
    prompt = "Gomoku$ ",
    gameBoard;

gameBoard = new GomokuBoard();



var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", function(line) {
    switch (line.trim()) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;
        default:
            arg = line.split(" ");
            xpos = parseInt(arg[0]);
            ypos = parseInt(arg[1]);
            placeMarker(xpos, ypos, arg);
    }
    rl.prompt();
});



rl.on("close", function() {
  rl.write("Bye!");
  process.exit(0);
});


/**
 * Returns a random integer between min (included) and max (included)
 * Using Math.round() will give you a non-uniform distribution!
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Place a marker on the board.
 */
function placeMarker(xpos, ypos, arg) {
    var x, y,
        player = gameBoard.playerInTurn();

    while (!gameBoard.isFull()) {
        if (arg.length == 2){
            if ( xpos < size && ypos < size){
                x = xpos;
                y = ypos;
            } else {
                console.log("Position is outside of the board, i played random for you!");
                            x = getRandomIntInclusive(0, size);
                            y = getRandomIntInclusive(0, size);

            }

        } else {
            x = getRandomIntInclusive(0, size);
            y = getRandomIntInclusive(0, size);

        }

        if (!gameBoard.isPositionTaken(x, y)) {
            break;
        }



    }

    gameBoard.place(x, y);
    console.log(">>> " + player + " places " + x + " " + y + "\n");
    console.log(gameBoard.asAscii());
}



// Here starts the actual main program
console.log(">>> Start the game with board size of " + size);
gameBoard.start(size);

rl.setPrompt(prompt);
rl.prompt();
