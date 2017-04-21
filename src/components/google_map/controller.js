import ko from 'knockout'
import GoogleMapsLoader from 'google-maps'
import { component } from 'utils/decorators'




@component({
  name: 'google-map',
  template: require('./view.html')
})
class GoogleMapController {
  constructor(params) {
    this.showMap = ko.observable(false);

    GoogleMapsLoader.KEY = 'AIzaSyAjN_VCsrqtlCqyozjTV7L8z_JYMeYBKzg';
    GoogleMapsLoader.LIBRARIES = ['places'];
    GoogleMapsLoader.load(this.getUserLocation.bind(this))

  }

  getUserLocation(google){
    this.initMap(google, {lat: -7.1562833, lng: 110.0800594});
    // if(navigator.geolocation){
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     this.initMap(google, pos)
    //
    //   }, () => {
    //     this.handleError();
    //     this.initMap(google, {lat: -7.1562833, lng: 110.0800594});
    //   });
    //
    // }else{
    //   this.handleError();
    //   this.initMap(google, {lat: -7.1562833, lng: 110.0800594});
    // }
  }

  initMap(google, pos){
    this.showMap(true);
    this.map = new google.maps.Map(document.getElementById('google-map'), {
      center: pos,
      scrollwheel: false,
      zoom: 10,
      disableDefaultUI: true
    });
  }

  handleError(){

  }

  onSearchSubmitCallback(){
    var resultsWrap = document.getElementById('results-wrapper');
    resultsWrap.classList.add('show');
    document.getElementById('autocomplete-wrapper').style.top = "80px";
  }

  onSearchResetCallback(){
    var resultsWrap = document.getElementById('results-wrapper');
    resultsWrap.classList.remove('show');
  }
}
