import axios from 'axios'
import { mapSingleton } from 'utils/map';



export const autoCompleteRequest = function (params, callback) {
  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions(params, callback);
}

export const searchTextRequest = function (params, callback) {
  var service = new google.maps.places.PlacesService(mapSingleton.getMap());
  service.nearbySearch(params, callback);
}


export const googlePlaceDetailRequest = function (id, callback) {

}


export const yelpPlaceDetailRequest = function () {

}
