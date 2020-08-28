// Define a function fetchMyIP which will asynchronously return our IP Address using an API.
// Makes a single API request to retrieve the user's IP address.
// * Input:
// *   - A callback (to pass back an error or the IP string)
// * Returns (via Callback):
// *   - An error, if any (nullable)
// *   - The IP address as a string (null if error). Example: "162.245.144.188"
// */

//++++++++++++++=++++++++++++++++++++++++
const request = require('request');

const fetchMyIP = function (callback) { 
  const api = 'https://api.ipify.org?format=json';

  request(api, function (error, response, body) {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  })
 // use request to fetch IP address from JSON API
}

// fetchMyIP();

module.exports = { fetchMyIP };