/**
 * Main program to run a simple server that says Hello World.
 *
 */
import server from './server.js';

// Start the server to listen on a port
server.listen(1337);

console.log("Simple server listen on port 1337.");
console.log('Try routes / and /index.html and /status and /sum and /filter?value1&value2&value3');
