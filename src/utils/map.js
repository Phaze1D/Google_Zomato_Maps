import GoogleMapsApiLoader from 'google-maps-api-loader'

/** Class that represents single google map */
class MapSingleton {

  /**
  * @constructor MapSingleton
  * @member {google.maps.Map} map
  * @member {google.maps.Geocoder} geocoder
  */
  constructor() {
    this.map = null;
    this.geocoder = null;
  }

  /**
  * Loads the google javascript library and initializes the map
  * @param {function} onRequestLoad - Callback for successful load
  * @param {function} onRequestError - Callback for failed load
  */
  load(success, failed) {
    GoogleMapsApiLoader({
        libraries: ['places'],
        apiKey: 'AIzaSyByjXf_TKYNHIkFzN4oVOIuAwHGi8ZzXos'
    })
    .then((googleApi) => {
      this.__initMap(googleApi);
      success();
    }, (err) => {
      failed(err.toString());
    });
  }

  /**
  * Private function that initializes the map
  * @param {object} google - The google javascript object
  * @param {object} pos - The maps init center position
  */
  __initMap(google) {
    this.geocoder = new google.maps.Geocoder();
    this.map = new google.maps.Map(document.getElementById('google-map'), {
      center: {lat: 37.425713 , lng: -122.1703695},
      scrollwheel: false,
      zoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      disableDefaultUI: true
    });
  }

  /**
  * @return The initialized map
  */
  getMap() {
    return this.map;
  }

  /**
  * @return The map center
  */
  getCenter() {
    return this.map.getCenter()
  }

  /**
  * @return The google api key
  */
  getKey() {
    return 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
  }

  /**
  * Finds the current users location
  */
  relocate(success, failed) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(pos)
        success();
      }, (error) => {
        failed(error.message);
      });

    } else {
      failed('Unknown Error');
    }
  }
}


export const mapSingleton = new MapSingleton();
