const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  // console.log(data);
  let coordinates;

  if (!data || data.status === 'ZERO_RESULTS') {
    console.log(address);
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    // throw error;
    coordinates = {
      lat: 0, lng: 0
    }
  } else {
    coordinates = data.results[0].geometry.location;
  }

  return coordinates;
}

async function getMilesAndTime(lat1, lng1, lat2, lng2) {

  const str = "origins=" + lat1 + "," + lng1 + "&" + "destinations=" + lat2 + "%2C" + lng2;
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&${str}&key=${API_KEY}`
  );
  const data = response.data;
  // console.log(encodeURIComponent(str));
  // console.log(data.rows[0].elements[0].distance.text);
  // console.log(data.rows[0].elements[0].duration.text);
  return data;
};

exports.getCoordsForAddress = getCoordsForAddress;
exports.getMilesAndTime = getMilesAndTime;
