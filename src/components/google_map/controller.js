import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { googleSearchAPI, googleDetailAPI, googleGeoCoder } from 'utils/google_tools';
import { zomatoSearchAPI, zomatoDetailAPI } from 'utils/zomato_tools';




@component({
  name: 'google-map',
  template: require('./view.html')
})
class GoogleMapController {
  constructor(params) {
    this.showMap = ko.observable(false);
    this.fetching = ko.observable(false);
    this.place = ko.observable({reviews: []});
    this.results = ko.observableArray();
    this.type = ko.observable(true);
    this.markers = [];
    this.mainMarker = null;

    mapSingleton.load(() => {
      this.mainMarker = new google.maps.Marker({});
      this.mainMarker.showingItem = false;
      this.showMap(true)
    });

    this.onSubmitCallback = this.onSubmitCallback.bind(this);
    this.onResetCallback  = this.onResetCallback.bind(this);
    this.onBackCallback   = this.onBackCallback.bind(this);
    this.onItemCallback   = this.onItemCallback.bind(this);
    this.onItemMouseIn    = this.onItemMouseIn.bind(this);
    this.onItemMouseOut   = this.onItemMouseOut.bind(this);
    this.onSearchCallback = this.onSearchCallback.bind(this);
    this.onDetailCallback = this.onDetailCallback.bind(this);
    this.onErrorCallback  = this.onErrorCallback.bind(this);
    this.onGeoCallback    = this.onGeoCallback.bind(this);

    this.type.subscribe(() => this.onResetCallback());
  }

  showResults(show){
    var resultsWrap = document.getElementById('results-wrapper');
    resultsWrap.classList[show ? 'add' : 'remove']('show');
  }

  showItem(show){
    var itemsWrap = document.getElementById('item-wrapper');
    itemsWrap.classList[show ? 'add' : 'remove']('show');
    document.getElementById('autocomplete-wrapper').style.top = show ? "80px" : '';
    document.getElementById('item-above').scrollTop = 0;
    this.mainMarker.showingItem = show;
  }

  showMainMarker(location){
    this.mainMarker.setPosition(location);
    this.mainMarker.setMap(mapSingleton.getMap());
  }

  hideMainMarker(){
    if(!this.mainMarker.showingItem){
      this.mainMarker.setMap(null);
      this.mainMarker.setAnimation(null);
    }
  }

  addMarker(place){
    let marker = new google.maps.Marker({
      map: mapSingleton.getMap(),
      position: place.geometry.location,
      icon: {
        url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
        anchor: new google.maps.Point(5, 5),
        scaledSize: new google.maps.Size(10, 17)
      }
    });
    google.maps.event.addListener(marker, 'click', () => this.onItemCallback(place));
    this.markers.push(marker);
  }

  deleteMarkers(){
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  onSubmitCallback(query){
    this.fetching(true);
    this.deleteMarkers();
    this.results.removeAll();

    if(this.type()){
      googleSearchAPI(query, this.onSearchCallback, this.onErrorCallback);
    }else{
      zomatoSearchAPI(query, this.onSearchCallback, this.onErrorCallback);
    }
  }

  onResetCallback(){
    this.deleteMarkers();
    this.showResults(false);
    this.showItem(false);
    this.hideMainMarker();
  }

  onBackCallback(){
    this.showResults(true);
    this.showItem(false);
    this.hideMainMarker();
  }

  onItemCallback(item){
    if(this.type()){
      googleDetailAPI(item.id, this.onDetailCallback, this.onErrorCallback);
    }else{
      zomatoDetailAPI(item.id, this.onDetailCallback, this.onErrorCallback);
    }
    this.showMainMarker(item.geometry.location);
    this.mainMarker.setAnimation(google.maps.Animation.BOUNCE);
    this.fetching(true);
  }

  onItemMouseIn(detail){
    this.showMainMarker(detail.geometry.location);
  }

  onItemMouseOut(){
    this.hideMainMarker();
  }

  onSearchCallback(results){
    let bounds = new google.maps.LatLngBounds();
    results.forEach((result) => {
      if(result.geometry.location.lat != 0 && result.geometry.location.lng != 0){
        this.addMarker(result);
        bounds.extend(result.geometry.location);
      }else{
        googleGeoCoder(result.address, this.onGeoCallback, this.onErrorCallback);
      }
    });

    if(results.length > 0){
      mapSingleton.getMap().fitBounds(bounds);
    }
    ko.utils.arrayPushAll(this.results, results)
    this.fetching(false);
    this.showResults(true);
    this.showItem(false);
  }

  onDetailCallback(detail){
    this.place(detail)
    this.showResults(false);
    this.showItem(true);
    this.fetching(false);
  }

  onGeoCallback(result){
    this.addMarker(result);
  }

  onErrorCallback(error){
    console.log(error);
  }
}
