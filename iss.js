// iss.js
const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function (coordinates, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => { //getting my ip, fetchMyIP passes ip to fetchCoordsByIP. fetchMyIP gets times! from fetchCoordsByIP as a value of its callback.
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {// fetchCoordsByIP takes ip from fetchMyIP to get coords. fetchCoordsByIP gives coords as the parameter fetchISSFlyOverTimes to get times! fetchCoordsByI gives times! to etchMyIP as a value of callback of fetchISSFlyOverTime.
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {//etchISSFlyOverTimes ftakes coord from fetchCoordsByIP  to get times. fetchISSFlyOverTimes gives this (times!) as a value of callback to fetchCoordsByIP.
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses); // this is callback which transmit Times upper as a result.
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

//module.exports = { fetchCoordsByIP, fetchMyIP, fetchISSFlyOverTimes};
//module.exports = { fetchCoordsByIP };
