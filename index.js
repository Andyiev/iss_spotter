// index.js
//const { fetchCoordsByIP } = require('./iss');
const { fetchMyIP, fetchCoordsByIP } = require('./iss');
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
