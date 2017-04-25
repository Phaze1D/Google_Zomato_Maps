import axios from 'axios';
import { mapSingleton } from 'utils/map';


const ZOMATO_KEY = 'f298bdd01d0c9561dacc373c6bee7a68';
const DEFAULT_THUMB = 'https://maps.gstatic.com/tactile/omnibox/list-result-no-thumbnail-1x.png';
const DEFAULT_COVER = 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png';

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
    success(formatResults(response.data.restaurants));
  }).catch((error) => {
    failed(error);
  });
}

export let zomatoDetailAPI = function (id, success, failed) {

  axios.all([zomatoSingleAPI(id), zomatoReviewsAPI(id)])
  .then((responses) => {
    responses[0].data.reviews = responses[1].data.user_reviews;
    success(formatPlace(responses[0].data));
  }).catch((error) => {
    failed(error);
  })
}

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


let formatResults = function (results) {
  let formated = results.map((result) => {
    let rating = Number(result.restaurant.user_rating.aggregate_rating);
    return {
      id: Number(result.restaurant.id),
      name: result.restaurant.name,
      rating: rating > 0 ? rating : undefined,
      type: result.restaurant.cuisines,
      address: result.restaurant.location.address,
      geometry: {
        location: {
          lat: Number(result.restaurant.location.latitude),
          lng: Number(result.restaurant.location.longitude)
        }
      },
      open: result.restaurant.is_delivering_now,
      thumb: result.restaurant.thumb ? result.restaurant.thumb : DEFAULT_THUMB
    };
  });
  return formated;
}

let formatPlace = function (result) {
  let rating = Number(result.user_rating.aggregate_rating);
  let place =  {
    id: Number(result.id),
    name: result.name,
    rating: rating > 0 ? rating : undefined,
    address: result.location.address,
    phone: result.phone_numbers,
    geometry: {
      location: {
        lat: Number(result.location.latitude),
        lng: Number(result.location.longitude)
      }
    },
    open: result.is_delivering_now,
    cover: result.featured_image ? result.featured_image : DEFAULT_COVER
  };

  if(rating > 0 && result.reviews){
    place.reviews = result.reviews.map((review) => {
      return {
        author_name: review.review.user.name,
        rating: review.review.rating,
        text: review.review.review_text
      }
    });
  }

  return place;
}
