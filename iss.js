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


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };


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