import GoogleMapsLoader from 'google-maps'

class MapSingleton {
  constructor() {
    this.map = null;
    this.geocoder = null;
    GoogleMapsLoader.KEY = 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
    GoogleMapsLoader.LIBRARIES = ['places'];
  }

  load(onLoadRequest, onErrorRequest){
    this.onLoadRequest = onLoadRequest;
    GoogleMapsLoader.load(this.__initLoad.bind(this));
  }

  __initLoad(google){
    if(navigator.geolocation){
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

    }else{
      this.handleError();
      this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
    }
  }

  __initMap(google, pos){
    this.onLoadRequest();
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

  getMap(){
    return this.map;
  }

  getCenter(){
    return this.map.getCenter()
  }

  getKey(){
    return 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
  }

  relocate(success, failed){
    if(navigator.geolocation){
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

    }else{
      failed('Unknown Error');
    }
  }
}


export const mapSingleton = new MapSingleton();
