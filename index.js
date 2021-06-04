// index.js
//const { fetchCoordsByIP } = require('./iss');
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

let ip = '';

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
  
});

fetchCoordsByIP(ip, (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:' , coordinates);
});



const coordinates = { latitude: 50.4833, longitude: -104.6091 };

fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    //return;
  }

  console.log('It worked! Returned flyover times:' , passTimes);
});
