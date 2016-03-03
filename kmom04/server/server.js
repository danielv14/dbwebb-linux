/**
 * Server with routes.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');



var server = http.createServer((req, res) => {

    var ipAddress,
        route,
        data,
        filename;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);


    // Switch (route) on the path.
    switch (route) {
        case '/':
            // Home page route.
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello World!\n');
        break;

        case '/index.html':
            // Index.
            filename = 'index.html';
            data = fs.readFileSync(filename, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        break;

        case '/status':
            // status.
            // res.writeHead(200, { 'Content-Type': 'application/json' });
            var child = require('child_process');

            // Execute a child process, in this case 'uptime'.
            child.exec('uname -a && date', (error, stdout, stderr) => {
                if (error || stderr) {
                    // Do something with the error(s)
                    console.log('Something went wrong...', error, stderr);
                }

                // Set the content type to json.
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // Create variable that splits the stdout by newline
                var splitCommand = stdout.split("\n");
                res.end(JSON.stringify({ uname: splitCommand[0], date: splitCommand[1] }, null, 4));
                console.log(splitCommand[1]);
          });

        break;

        case '/sum':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            var queryObject = url.parse(req.url, true);

            var splitQuery = JSON.stringify(queryObject.search.split("&"));
            // Replace chars in the string
            splitQuery = splitQuery.replace('?', '');
            splitQuery = splitQuery.replace(/"/gi, '');
            splitQuery = splitQuery.replace('[', '');
            splitQuery = splitQuery.replace(']', '');

            splitQuery = splitQuery.split(',');
            var summa = 0;
            // Loop through the array and add the values to a variable
            for (var i = 0; i < splitQuery.length; i++) {
              summa += parseInt(splitQuery[i], 10);
            }

            res.end(JSON.stringify({ sum: summa }));
        break;

        case '/filter':
            // filter.
            res.writeHead(200, { 'Content-Type': 'application/json' });
            var queryObject2 = url.parse(req.url, true);
            var splitFilter = JSON.stringify(queryObject2.search.split("&"));
            // Split it
            splitFilter = splitFilter.replace('?', '');
            splitFilter = splitFilter.replace(/"/gi, '');
            splitFilter = splitFilter.replace('[', '');
            splitFilter = splitFilter.replace(']', '');
            var splitAgain = splitFilter.split(',');
            // Loop through and find numbers
            for (var e = splitAgain.length - 1; e >= 0; e--) {
              if (splitAgain[e] > 42) {
                  splitAgain.splice(e, 1);
              }
            }
            var createString = String(splitAgain);
            createString = '[' + createString + ']';
            res.end(JSON.stringify({ filter: createString.replace('"', '') }, null, 4));

        break;

        default:
            // Not found route.
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404. The resource does not exists.\n');
        break;
    }
});

// Export the server as a module.
export default server;
