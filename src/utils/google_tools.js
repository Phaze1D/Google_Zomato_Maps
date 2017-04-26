import { mapSingleton } from 'utils/map';

const DEFAULT_THUMB = 'https://maps.gstatic.com/tactile/omnibox/list-result-no-thumbnail-1x.png';
const DEFAULT_COVER = 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png';

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
      success(formatResults(results));
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
      success(formatPlace(place));
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

/**
* Formats the results from the google's search api call so that it can be used
* in the ResultViewModel
* @param {array} results - The googles search api results
* @return {array} A formated results array
*/
let formatResults = function (results) {
  let formated = results.map( (result) => {
    return {
      id: result.place_id,
      name: result.name,
      rating: result.rating,
      type: result.types ? result.types[0].replace("_", " ") : '',
      address: result.vicinity,
      geometry: result.geometry,
      open: result.opening_hours ? result.opening_hours.open_now : false,
      thumb: result.photos ? result.photos[0].getUrl({'maxWidth': 160}) : DEFAULT_THUMB
    }
  });
  return formated;
}

/**
* Formats the result from the google's place api call so that it can be used
* in the ItemViewModel
* @param {object} result - The googles place api result
* @return {object} A formated result
*/
let formatPlace = function (result) {
  let place =  {
    id: result.place_id,
    name: result.name,
    rating: result.rating,
    type: result.types ? result.types[0].replace("_", " ") : '',
    address: result.vicinity,
    phone: result.phone_number,
    geometry: result.geometry,
    open: result.opening_hours ? result.opening_hours.open_now : false,
    cover: result.photos ? result.photos[0].getUrl({'maxWidth': 400}) : DEFAULT_COVER
  };

  if (result.rating > 0 && result.reviews) {
    place.reviews = result.reviews.map((review) => {
      return {
        author_name: review.author_name,
        rating: review.rating,
        text: review.text
      }
    });
  }

  return place;
}
