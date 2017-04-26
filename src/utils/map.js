import GoogleMapsLoader from 'google-maps'

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
    GoogleMapsLoader.KEY = 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
    GoogleMapsLoader.LIBRARIES = ['places'];
  }

  /**
  * Loads the google javascript library and initializes the map
  * @param {function} onRequestLoad - Callback for successful load
  * @param {function} onRequestError - Callback for failed load
  */
  load(onRequestLoad, onRequestError) {
    this.onRequestLoad = onRequestLoad;
    GoogleMapsLoader.load(this.__initLoad.bind(this));
  }

  /**
  * Private function that gets that user location
  * @param {object} google - The google javascript object
  */
  __initLoad(google) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.__initMap(google, pos)

      }, () => {
        this.handleError();
        this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
      });

    } else {
      this.handleError();
      this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
    }
  }

  /**
  * Private function that initializes the map
  * @param {object} google - The google javascript object
  * @param {object} pos - The maps init center position
  */
  __initMap(google, pos) {
    this.onRequestLoad();
    this.geocoder = new google.maps.Geocoder();
    this.map = new google.maps.Map(document.getElementById('google-map'), {
      center: pos,
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
