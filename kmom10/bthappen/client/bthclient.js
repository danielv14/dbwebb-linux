/**
 * Front for BTHServer
 */



// Import the http server as base
var http = require("http");



/**
 * Class for bth-appen.
 *
 */
class BthClient {



    /**
     * Constructor.
     *
     */
    constructor() {
        //this.gameBoard = new GomokuBoard();
    }




    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }



    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }


    /**
    * List all the rooms
    *
    * @return Promise
    *
    */
    list() {
      return this.httpGet("/room/list/");
    }

    /**
    * List all the rooms by a max value
    *
    * @param Integer max Max value to return
    *
    * @return Promise
    */
    listMax(max) {
      return this.httpGet("/room/list?max=" + max);
    }

    /**
    * View info about a classroom ID
    *
    * @param String id
    *
    * @return Promise
    *
    */
    viewID(id) {
      return this.httpGet("/room/view/id/" + id);
    }


    /**
    * List all classroom ID's in a specific house
    *
    * @param String house
    *
    * @return Promise
    *
    */
    viewHouse(house) {
      return this.httpGet("/room/view/house/" + house);
    }

    /**
    * List all the classroom Id's in a specific house and by a max value
    *
    * @param String house string to search for
    * @param Integer max Max value to return
    * @return Promise
    */
    viewHouseMax(house, max) {
      return this.httpGet("/room/view/house/" + house + "?max=" + max);
    }



    /**
    * Search entire json by substring
    *
    * @param String search
    *
    * @return Promise
    *
    */
    viewSearch(search) {
      return this.httpGet("/room/search-all/" + search);
    }

    /**
    * Search entire json by substring
    *
    * @param String search
    * @param Integer max Max value to return
    * @return Promise
    *
    */
    viewSearchMax(search, max) {
      return this.httpGet("/room/search-all/" + search + "?max=" + max);
    }


}

export default BthClient;
