#!/usr/bin/env babel-node

/**
 * Main program to run the Gomoku server
 *
 */

const VERSION = "1.0.0";

// For CLI usage
var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;





// Get the server with defaults
import bthclient from "./bthclient.js";


var bth = new bthclient();
var server = "http://localhost";
var port = 1337;





// Make it using prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set the server url to use.`);
}



/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}



// Walkthrough all arguments checking for options.
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

        case "--server":
            server = args.shift();
            if (server === undefined) {
                badUsage("--server must be followed by a url.");
                process.exit(1);
            }
            break;


        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;



        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}



/**
 * Display a menu.
 */
function menu() {
    console.log(`Commands available:
 exit                     Leave this program.
 menu                     Print this menu.
 url                      Get url to view in browser.
 list <number>            List all rooms.
 view <id>                View the room with the selected id.
 house <house> <number>   View the names of all rooms in this building (house).
 search <string> <number> View the details of all matching rooms (one per row).

 <number> specifies how many results you want to see.
 <number> does not necessarily need to be set for a command to be executed.
 If <number> is not specified all results will be viewed.`);
}



/**
 * Callbacks
 */
 rl.on("line", function(line) {
     // Split incoming line with arguments into an array
     var args = line.trim().split(" ");
     args = args.filter(value => {
         return value !== "";
     });

    switch (args[0]) {
        case "exit":
             console.log("Bye!");
             process.exit(0);
             break;

        case "menu":
             menu();
             rl.prompt();
             break;

        case "list":
            // If args[1]
            if (args[1]) {
              bth.listMax(args[1])
              .then(value => {
                 console.log(value);
                 rl.prompt();
             })
             .catch(err => {
                 console.log("FAILED: Could not list all the classrooms.\nDetails: " + err);
                 rl.prompt();
             });
           } else {
             bth.list()
             .then(value => {
                console.log(value);
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list all the classrooms.\nDetails: " + err);
                rl.prompt();
            });
            }
            break;


        case "view":
            bth.viewID(args[1])
            .then(value => {
                console.log(value);
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not view the classroom ID.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "house":
            // If max is set as args[2]
            if (args[2]) {
              bth.viewHouseMax(args[1], args[2])
              .then(value => {
                  console.log(value);
                  rl.prompt();
              })
              .catch(err => {
                  console.log("FAILED: Could not view the classrooms in the house.\nDetails: " + err);
                  rl.prompt();
              });
            } else {
              bth.viewHouse(args[1])
              .then(value => {
                  console.log(value);
                  rl.prompt();
              })
              .catch(err => {
                  console.log("FAILED: Could not view the classrooms in the house.\nDetails: " + err);
                  rl.prompt();
              });
            }
            break;

        case "search":
            if (args[2]) {
              bth.viewSearchMax(args[1], args[2])
              .then(value => {
                  console.log(value);
                  rl.prompt();
              })
              .catch(err => {
                  console.log("FAILED: Could not search.\nDetails: " + err);
                  rl.prompt();
              });
            } else {
              bth.viewSearch(args[1])
              .then(value => {
                  console.log(value);
                  rl.prompt();
              })
              .catch(err => {
                  console.log("FAILED: Could not search.\nDetails: " + err);
                  rl.prompt();
              });
            }
            break;


        case "url":
            console.log("Click this url to view in a browser.\n" + server + ":" + port);
            rl.prompt();
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
     }
 });



 rl.on("close", function() {
     console.log("Bye!");
     process.exit(0);
 });



// Main
bth.setServer(server + ":" + port);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server url " + server + ":" + port);
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("BTHappen$ ");
rl.prompt();
