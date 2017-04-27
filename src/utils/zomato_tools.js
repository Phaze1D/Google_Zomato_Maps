import axios from 'axios';
import { mapSingleton } from 'utils/map';
import Place from 'models/place';


const ZOMATO_KEY = 'f298bdd01d0c9561dacc373c6bee7a68';


/**
* Functions that calls the Zomato Search Complete API
* @param {string} query - The search query
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let zomatoSearchAPI = function(query, success, failed) {
  let params = {
    q: query,
    lat: mapSingleton.getCenter().lat(),
    lon: mapSingleton.getCenter().lng(),
    radius: 2000
  }
  axios.get('https://developers.zomato.com/api/v2.1/search', {
    params: params,
    headers: {
      'user-key': ZOMATO_KEY,
      'Accept':'application/json'
    }
  }).then((response) => {
    success( response.data.restaurants.map((result) => Place.placeFromZomato(result.restaurant)));
  }).catch((error) => {
    failed(error.toString());
  });
}

/**
* Functions that calls the Zomato Place API
* @param {number} id - The id of the place
* @param {function} success - The callback function called if successful
* @param {function} failed - The callback function called if failed
*/
export let zomatoDetailAPI = function (id, success, failed) {

  axios.all([zomatoSingleAPI(id), zomatoReviewsAPI(id)])
  .then((responses) => {
    responses[0].data.reviews = responses[1].data.user_reviews;
    success(Place.placeFromZomato(responses[0].data));
  }).catch((error) => {
    failed(error.toString());
  })
}

/**
* Functions that calls the Zomato Place API
* @param {number} id - The id of the place
* @return {Promise}
*/
let zomatoSingleAPI = function (id) {
  let params = {res_id: id};
  return axios.get('https://developers.zomato.com/api/v2.1/restaurant', {
    params: params,
    headers: {
      'user-key': ZOMATO_KEY,
      'Accept':'application/json'
    }
  })
}

/**
* Functions that calls the Zomato Place Reviews API
* @param {number} id - The id of the place
* @return {Promise}
*/
let zomatoReviewsAPI = function (id) {
  let params = {res_id: id};
  return axios.get('https://developers.zomato.com/api/v2.1/reviews', {
    params: params,
    headers: {
      'user-key': ZOMATO_KEY,
      'Accept':'application/json'
    }
  })
}
