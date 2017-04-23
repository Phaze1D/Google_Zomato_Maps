import GoogleMapsLoader from 'google-maps'

class MapSingleton {
  constructor() {
    this.map = ''
    GoogleMapsLoader.KEY = 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
    GoogleMapsLoader.LIBRARIES = ['places'];
  }

  load(onLoadRequest, onErrorRequest){
    this.onLoadRequest = onLoadRequest;
    GoogleMapsLoader.load(this.__initLoad.bind(this));
  }

  __initLoad(google){
    // this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
    this.__initMap(google, {lat: 20.6724354, lng: -103.3796223});
    // if(navigator.geolocation){
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     this.__initMap(google, pos)
    //
    //   }, () => {
    //     this.handleError();
    //     this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
    //   });
    //
    // }else{
    //   this.handleError();
    //   this.__initMap(google, {lat: -7.1562833, lng: 110.0800594});
    // }
  }

  __initMap(google, pos){
    this.onLoadRequest();
    this.map = new google.maps.Map(document.getElementById('google-map'), {
      center: pos,
      scrollwheel: false,
      zoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
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
}


export const mapSingleton = new MapSingleton();
