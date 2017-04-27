import { mapSingleton } from 'utils/map';

const DEFAULT_THUMB = 'https://maps.gstatic.com/tactile/omnibox/list-result-no-thumbnail-1x.png';
const DEFAULT_COVER = 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png';

export default class Place {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.rating = props.rating;
    this.type = props.typs;
    this.address = props.address;
    this.phone = props.phone;
    this.geometry = props.geometry;
    this.open = props.open;
    this.thumb = props.thumb;
    this.cover = props.cover;
    this.reviews = props.reviews;
    this.marker = null;
  }

  createMarker() {
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        map: mapSingleton.getMap(),
        position: this.geometry.location,
        icon: {
          url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
          anchor: new google.maps.Point(5, 5),
          scaledSize: new google.maps.Size(12, 20)
        }
      });

      google.maps.event.addListener(this.marker, 'click', () => this.onRequestClick(this));
    }
  }

  hideMarker() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  showMarker() {
    if (this.marker) {
      this.marker.setMap(mapSingleton.getMap());
    }
  }

  static placeFromZomato(result) {
    let rating = Number(result.user_rating.aggregate_rating);
    let place = {
      id: Number(result.id),
      name: result.name,
      rating: rating > 0 ? rating : undefined,
      type: result.cuisines,
      address: result.location.address,
      geometry: {
        location: {
          lat: Number(result.location.latitude),
          lng: Number(result.location.longitude)
        }
      },
      open: result.is_delivering_now,
      thumb: result.thumb ? result.thumb : DEFAULT_THUMB,
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

    return new Place(place);
  }

  static placeFromGoogle(result) {
    let place =  {
      id: result.place_id,
      name: result.name,
      rating: result.rating,
      type: result.types ? result.types[0].replace("_", " ") : '',
      address: result.vicinity,
      phone: result.phone_number,
      geometry: result.geometry,
      open: result.opening_hours ? result.opening_hours.open_now : false,
      thumb: result.photos ? result.photos[0].getUrl({'maxWidth': 160}) : DEFAULT_THUMB,
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

    return new Place(place);
  }

}
