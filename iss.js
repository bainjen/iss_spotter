// Define a function fetchMyIP which will asynchronously return our IP Address using an API.
// Makes a single API request to retrieve the user's IP address.
// * Input:
// *   - A callback (to pass back an error or the IP string)
// * Returns (via Callback):
// *   - An error, if any (nullable)
// *   - The IP address as a string (null if error). Example: "162.245.144.188"
// */
 /**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
//++++++++++++++=++++++++++++++++++++++++
const request = require('request');

const fetchMyIP = function(callback) {
  const api = 'https://api.ipify.org?format=json';

  request(api, function(error, response, body) {
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
  });

};

//++++++++++++++++++++++++++++++++++++++++++++++

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });
  });
};

//++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  const coordsURL = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(coordsURL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });

};

//++++++++++++++++++++++++++++++++++++++++++++
// * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
//  * Input:
//  *   - A callback with an error or results. 
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The fly-over times as an array (null if error):
//  *     [ { risetime: <number>, duration: <number> }, ... ]

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };


// const fetchCoordsByIP = function (ip, callback) {
//   const coordsObj = 'https://ipvigilante.com/json/';
//   const hardCodeIp = '184.64.190.233';

//   request(`${coordsObj}${hardCodeIp}`, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }
//   })



//   if (response.statusCode !== 200) {
//     const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
//     callback(Error(msg), null);
//     return;
//   }
//   const { latitude, longitude } = JSON.parse(body).data;

//   callback(null, {latitude, longitude});

// }


// fetchCoordsByIP();
// https://ipvigilante.com/{format}/{IP}/{params}
// https://ipvigilante.com/json/
// iss.js
/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */