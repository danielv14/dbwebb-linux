
// A better router to create a handler for all routes
import Router from "./router";
var router = new Router();



// Import the http server as base
var http = require("http");
var url = require("url");
var fs = require("fs");
//var util = require('util');


// the json file
var theFile = fs.readFileSync('../salar.json');
// Parse it
var jsonContent = JSON.parse(theFile);
// Create default empty  result object
var result = [];


/**
 * Wrapper function for sending a JSON response
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
function sendJSONResponse(res, content, code = 200) {
    res.writeHead(code, "Content-Type: application/json");
    res.write(JSON.stringify(content, null, "    "));
    res.end();
}

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {

    res.writeHead(200, "Content-Type: text/plain");
    res.write("This is the available routes.\n\n"
        + " /                            Display this helptext.\n"
        + " /room/list                   List all the classrooms.\n"
        + " /room/view/id/:number        View info about classroom of that number.\n"
        + " /room/view/house/:house      View all the classrooms in that house.\n"
        + " /room/search/:search         Search for classrooms.\n"
    );
    res.end();
});


/**
* List all the classrooms
*
*/
function listAll() {

  // Set tempData
  var tempData = [];

  // Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i++) {
    tempData.push('Salsnr: ' + jsonContent.salar[i].Salsnr + " Salsnamn: " + jsonContent.salar[i].Salsnamn);

    result = tempData;
  }

  return result;
}
/**
* List all the classrooms by max value
*
* @param integer max Max value to iterate
*
*/

function listAllMax(max) {
  // Set tempData
  var tempData = [];

  // Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i++) {

    // while max is bigger than the iteration
    while (max > i) {
      tempData.push('Salsnr: ' + jsonContent.salar[i].Salsnr + " Salsnamn: " + jsonContent.salar[i].Salsnamn);

      result = tempData;
      i++;

    }

  }

  return result;

}



/**
 * List all the classrooms
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list?:max=", (req, res) => {


        // create varaible for maximum returns
        var maxReturnList = parseInt(req.query.max);

        // If a max query is set
        if (maxReturnList) {
          //console.log('Max har satts');
          listAllMax(maxReturnList);
        } else {
          listAll();
        }

        // invoke Function
        //listAll();
        sendJSONResponse(res, result);

});


/**
 * View info about classroom of that number
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/id/:number", (req, res) => {

        // Create a variable from the url parameter
        var roomNumber = req.params.number;

        // Loop through the jsonContent to find all the classrooms
        for (var i = 0; i < jsonContent.salar.length; i++) {

            // If the classroom numbers match the url parameter
            if (roomNumber == jsonContent.salar[i].Salsnr) {
              // Send json response with info about that Id
              sendJSONResponse(res, {
                "Salsnr": jsonContent.salar[i].Salsnr,
                "Salsnamn": jsonContent.salar[i].Salsnamn,
                "Lat": jsonContent.salar[i].Lat,
                "Long": jsonContent.salar[i].Long,
                "Ort:": jsonContent.salar[i].Ort,
                "Hus": jsonContent.salar[i].Hus,
                "Våning": jsonContent.salar[i].Våning,
                "Typ": jsonContent.salar[i].Typ,
                "Storlek": jsonContent.salar[i].Storlek
              });
            }
        }
        // Standard response if the :number doesnt match
         sendJSONResponse(res, {
           "Error": "No classroom with that ID. Try another one or go route /room/list for listing all of the classrooms",
         });


});

/**
* Function to find classrooms connected to a specific house
*
* @param String search house to search for
*/
function findHouse (searchHouse) {
  // Create tempData
  var tempData = [];

  // Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i ++) {
    // If the search matches a house
    if (searchHouse == jsonContent.salar[i].Hus) {
      // Push that classroom id to the tempData object
      tempData.push('Salsnr:' + jsonContent.salar[i].Salsnr);

      // set global result to tempData
      result = tempData;

    }
  }
  // Return the result
  return result;

}

/**
* Function to find classrooms connected to a specific house by a query string
*
* @param String search house to search for
* @param Integer max Max value to iterate
*/
function findHouseMax (searchHouse, max) {

  // Create tempData
  var tempData = [];
  // Create a temp iteration to check max variable against
  var tempIteration = 0;

  // Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i++) {
    // While max param is bigger than tempIteration
    while (max > tempIteration) {
      // Iterate i
      i++;
      // If the search param mathces a house
      if (searchHouse == jsonContent.salar[i].Hus) {
        // Iterate the temp varaible
        tempIteration++;
        // Push tempData with matching Salsnr
        tempData.push('Salsnr:' + jsonContent.salar[i].Salsnr);

        result = tempData;
      }
    }

  } // Return the result
  return result;


}


/**
 * View all the classrooms in a specific house
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {

        // Reset result
        result = [];

        // Create variables from the url
        var house = req.params.house;
        var maxReturnHouse = parseInt(req.query.max);

        // If a max query is set and house
        if (maxReturnHouse && house) {
          findHouseMax(house, maxReturnHouse);

        } else {
          findHouse(house);
        }

        // Send Json response
        sendJSONResponse(res, result);

});


/**
* Function to search the whole json
*
* @param String theSearch String to search by
*/
function searchEverything (theSearch) {

  // Create tempData object
  var tempData = [];
  //console.log('Searching everything for', theSearch ,' som är typ: ', typeof(theSearch));

  // Main Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i ++) {

    // Loop through all the keys to obtain their properties
     for (const key of Object.keys(jsonContent.salar[i])) {
       let val = jsonContent.salar[i][key];

       // If the search matches the properties
       if (val.indexOf(theSearch) >= 0) {
         // Push the classroom ID to tempData
         tempData.push("Match because of property '" + val + "'.  Classroom ID for the property is " + jsonContent.salar[i].Salsnr
          + " and the classroom name is " + jsonContent.salar[i].Salsnamn);
       }

     }

    // set result
    result = tempData;
  }
  //Return the result
  return result;
}

/**
* Function to search the whole json
*
* @param String theSearch String to search by
*/
function searchEverythingUltra (theSearch) {

  // Create tempData object
  var tempData = [];
  //console.log('Searching everything for', theSearch ,' som är typ: ', typeof(theSearch));

  // Main Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i ++) {

    // Loop through all the keys to obtain their properties
     for (const key of Object.keys(jsonContent.salar[i])) {
       let val = jsonContent.salar[i][key];

       // If the search matches the properties
       if (val.indexOf(theSearch) >= 0) {
         // Push the classroom ID to tempData
         tempData.push("Match because of property '" + val + "'. Salsnr is " + jsonContent.salar[i].Salsnr
          + " .Salsnamn is " + jsonContent.salar[i].Salsnamn +
          ". Lat is " + jsonContent.salar[i].Lat + ". Long is " + jsonContent.salar[i].Long +
          ". Ort is " + jsonContent.salar[i].Ort + ". Hus is " + jsonContent.salar[i].Hus +
          ". Våning is " + jsonContent.salar[i].Våning + ". Typ is " + jsonContent.salar[i].Typ +
          ". Storlek is " + jsonContent.salar[i].Storlek + ".");
       }

     }

    // set result
    result = tempData;
  }
  //Return the result
  return result;
}

/**
* Function to search the whole json
*
* @param String theSearch String to search by
* @param Integer max Max value to iterate
*/
function searchEverythingUltraMax (theSearch, max) {

  // Create tempData object
  var tempData = [];
  // create a temp iteration to check max variable against
  var tempIteration = 0;

  // Main Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i ++) {

    while (max > tempIteration) {
      // Iterate i
      i++;

      // Loop through all the keys to obtain their properties
       for (const key of Object.keys(jsonContent.salar[i])) {
         let val = jsonContent.salar[i][key];

         // If the search matches the properties
         if (val.indexOf(theSearch) >= 0) {

           // Iterate the temp integer varaible
           tempIteration++;

           // Push the classroom ID to tempData
           tempData.push("Match because of property '" + val + "'. Salsnr is " + jsonContent.salar[i].Salsnr
            + " .Salsnamn is " + jsonContent.salar[i].Salsnamn +
            ". Lat is " + jsonContent.salar[i].Lat + ". Long is " + jsonContent.salar[i].Long +
            ". Ort is " + jsonContent.salar[i].Ort + ". Hus is " + jsonContent.salar[i].Hus +
            ". Våning is " + jsonContent.salar[i].Våning + ". Typ is " + jsonContent.salar[i].Typ +
            ". Storlek is " + jsonContent.salar[i].Storlek + ".");
         }

       }

      // set result
      result = tempData;
    }
  }

  //Return the result
  return result;
}

/**
* Function to search the whole json
*
* @param String theSearch String to search by
* @param Integer max Max value to iterate
*/
function searchEverythingMax (theSearch, max) {

  // Create tempData object
  var tempData = [];
  // create a temp iteration to check max variable against
  var tempIteration = 0;

  // Main Loop through the json
  for (var i = 0; i < jsonContent.salar.length; i ++) {

    while (max > tempIteration) {
      // Iterate i
      i++;

      // Loop through all the keys to obtain their properties
       for (const key of Object.keys(jsonContent.salar[i])) {
         let val = jsonContent.salar[i][key];

         // If the search matches the properties
         if (val.indexOf(theSearch) >= 0) {

           // Iterate the temp integer varaible
           tempIteration++;

           // Push the classroom ID to tempData
           tempData.push("Match because of property '" + val + "'.  Classroom ID for the property is " + jsonContent.salar[i].Salsnr
            + " and the classroom name is " + jsonContent.salar[i].Salsnamn);
         }

       }

      // set result
      result = tempData;
    }
  }

  //Return the result
  return result;
}

/**
 * Search for anything
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {

         // Reset result
         result = [];
         // Create variables from the url
         var search = req.params.search;
         var maxSearch = parseInt(req.query.max);

         if (maxSearch && search) {
           searchEverythingMax(search, maxSearch);
         } else {
           // Invoke the search function
           searchEverything(search);
         }


         // Send Json response
         sendJSONResponse(res, result);

});




/**
* Search for anything and return all the info for a matching object.
* this router is only used because Krav 3 search should return all info when Searching
* and not just Salsnamn and Salsnr
*/
router.get("/room/search-all/:search", (req, res) => {
          // Reset result
          result = [];

          var searchAll = req.params.search;
          var maxSearchUltra = parseInt(req.query.max);

          if (maxSearchUltra && searchAll) {
            // Invoke the search function
            searchEverythingUltraMax(searchAll, maxSearchUltra);
          } else {
            // Invoke the search function
            searchEverythingUltra(searchAll);
          }



          // Send Json response
          sendJSONResponse(res, result);
});

/**
 * Create and export the server
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        route;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    // Let the router take care of all requests
    router.route(req, res);
});

export default server;
