import { mapSingleton } from 'utils/map';
import Place from 'models/place';


/**
* Functions that calls the Google Auto Complete API
* @param {string} value - The input value
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let googleAutocompleteAPI = function (value, success, failed) {
  var params = {
    input: value,
    location: mapSingleton.getCenter(),
    radius: 2000
  };
  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions(params, (results, status) => {
    if (status === 'OK' || status === 'ZERO_RESULTS') {
      results = results ? results : [];
      success(results);
    } else {
      status = status.replace('_', ' ');
      failed(status);
    }
  });
}

/**
* Functions that calls the Google Search  API
* @param {string} query - The query string
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let googleSearchAPI = function (query, success, failed) {
  let params = {
    keyword: query,
    location: mapSingleton.getCenter(),
    radius: 2000
  };
  let service = new google.maps.places.PlacesService(mapSingleton.getMap());
  service.nearbySearch(params, (results, status) => {
    if (status === 'OK' || status === 'ZERO_RESULTS') {
      results = results ? results : [];
      success(results.map((result) => Place.placeFromGoogle(result)));
    } else {
      status = status.replace('_', ' ');
      failed(status);
    }
  });
}

/**
* Functions that calls the Google Place API
* @param {number} id - The id of the place
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let googleDetailAPI = function (id, success, failed) {
  let params = {placeId: id};
  let service = new google.maps.places.PlacesService(mapSingleton.getMap());
  service.getDetails(params, (place, status) => {
    if (status === 'OK') {
      success(Place.placeFromGoogle(place));
    } else {
      status = status.replace('_', ' ');
      failed(status);
    }

  });
}

/**
* Functions that calls the Google Geocoder API
* @param {string} addres - The address string to convert to lat,lng
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let googleGeoCoder = function (address, success, failed) {
  mapSingleton.geocoder.geocode( { 'address': address}, (results, status) => {
    if (status === 'OK') {
      success(results[0]);
    } else {
      status = status.replace('_', ' ')
      failed(status);
    }
  });
}
