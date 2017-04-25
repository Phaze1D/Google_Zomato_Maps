import { mapSingleton } from 'utils/map';

const DEFAULT_THUMB = 'https://maps.gstatic.com/tactile/omnibox/list-result-no-thumbnail-1x.png';
const DEFAULT_COVER = 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png';


export let googleAutocompleteAPI = function (value, success, failed) {
  var params = {
    input: value,
    location: mapSingleton.getCenter(),
    radius: 2000
  };
  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions(params, (results, status) => {
    success(results);
  });
}

export let googleSearchAPI = function (query, success, failed) {
  let params = {
    keyword: query,
    location: mapSingleton.getCenter(),
    radius: 2000
  };
  let service = new google.maps.places.PlacesService(mapSingleton.getMap());
  service.nearbySearch(params, (results, status) => {
    success(formatResults(results));
  });
}

export let googleDetailAPI = function (id, success, failed) {
  let params = {placeId: id};
  let service = new google.maps.places.PlacesService(mapSingleton.getMap());
  service.getDetails(params, (place, status) => {
    success(formatPlace(place));
  });
}

export let googleGeoCoder = function (address, success, failed) {
  mapSingleton.geocoder.geocode( { 'address': address}, (results, status) => {
    success(results[0])
  });
}


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

  if(result.rating > 0 && result.reviews){
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
