import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { googleSearchAPI, googleDetailAPI, googleGeoCoder } from 'utils/google_tools';
import { zomatoSearchAPI, zomatoDetailAPI } from 'utils/zomato_tools';


@component({
  name: 'google-map',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents the Google Map View */
class GoogleMapViewModel {

  /**
  * @constructor GoogleMapViewModel
  * @member {observable} showMap - Boolean, whether to show the map
  * @member {observable} fetching - Boolean, whether something is fetching
  * @member {observable} showResults - Boolean, whether to show results view
  * @member {observable} showItem - Boolean, whether to show item view
  * @member {observable} type - Boolean, google or zomato
  * @member {observable} error - String, the error string to display
  * @member {observable} place - Object, the selected place to show
  * @member {observable} results - Array, the results array
  * @member {marker} mainMarker - The main marker that has animation
  */
  constructor() {
    this.showMap = ko.observable(false);
    this.fetching = ko.observable(false);
    this.showResults = ko.observable(false);
    this.showItem = ko.observable(false);
    this.type = ko.observable(true);
    this.error = ko.observable('');
    this.place = ko.observable();
    this.results = ko.observableArray();
    this.mainMarker = null;

    // Loads the map and creates the mainMarker
    mapSingleton.load(this.onMapLoadCallback.bind(this), this.onErrorCallback);

    // Binding callback functions
    this.onSubmitCallback = this.onSubmitCallback.bind(this);
    this.onResetCallback = this.onResetCallback.bind(this);
    this.onBackCallback = this.onBackCallback.bind(this);
    this.onItemCallback = this.onItemCallback.bind(this);
    this.onItemMouseIn = this.onItemMouseIn.bind(this);
    this.onItemMouseOut = this.onItemMouseOut.bind(this);
    this.onSearchCallback = this.onSearchCallback.bind(this);
    this.onDetailCallback = this.onDetailCallback.bind(this);
    this.onErrorCallback = this.onErrorCallback.bind(this);
    this.onGeoCallback = this.onGeoCallback.bind(this);
    this.onSearchBackCallback = this.onSearchBackCallback.bind(this);
    this.handleRelocate = this.handleRelocate.bind(this);

    // Resets when this.type changes
    this.type.subscribe(() => this.onResetCallback());
  }

  /**
  * Shows the item panel and moves the autocomplete list a 80px lower
  * Also resets the scroll position of the item panel
  * @param {boolean} show - whether to show or hide the panel
  */
  showItemPanel(show) {
    this.showItem(show);
    document.getElementById('autocomplete-wrapper').style.top = show ? "80px" : '';
    let itemdiv = document.getElementById('item-above');
    if(itemdiv) itemdiv.scrollTop = 0;
  }

  /**
  * Shows the mainmarker
  * @param {object} location - The location to place the marker
  */
  showMainMarker(location) {
    this.mainMarker.setPosition(location);
    this.mainMarker.setMap(mapSingleton.getMap());
  }

  /**
  * Hides the mainMarker only if the item panel is not showing
  */
  hideMainMarker() {
    if (!this.showItem()) {
      this.mainMarker.setMap(null);
      this.mainMarker.setAnimation(null);
    }
  }

  /**
  * Removes all markers from the map and resets the markers array
  */
  deleteMarkers() {
    this.results().forEach( (place) => place.hideMarker());
  }

  /**
  * Handler function called when the fab button is clicked
  */
  handleRelocate() {
    this.fetching(true);
    mapSingleton.relocate(() => this.fetching(false), this.onErrorCallback);
  }

  handleResponiveResults() {
    this.hideMainMarker();
    this.showResults( !(this.showResults() || this.showItem()) );
    this.showItemPanel(false);
  }

  /**
  * Called when google maps loads
  * @callback
  */
  onMapLoadCallback() {
    this.mainMarker = new google.maps.Marker({});
    this.showMap(true);
    setTimeout(() => this.onSubmitCallback('pizza'), 500);
  }

  /**
  * Called when the search input is submited
  * @callback SearchViewModel ~ onRequestSubmit
  * @param {string} query - The query to search for
  */
  onSubmitCallback(query) {
    this.fetching(true);
    this.deleteMarkers();
    this.results.removeAll();

    // If true call the google api else the zomate api
    if (this.type()) {
      googleSearchAPI(query, this.onSearchCallback, this.onErrorCallback);
    } else {
      zomatoSearchAPI(query, this.onSearchCallback, this.onErrorCallback);
    }
  }

  /**
  * Called when the clear button on the search bar is click
  * Hides panels and clears markers
  * @callback SearchViewModel ~ onRequestReset
  */
  onResetCallback() {
    this.deleteMarkers();
    this.showResults(false);
    this.showItemPanel(false);
    this.hideMainMarker();
  }

  /**
  * Called when the back arrow on the search bar is press. This arrow appears
  * when the screen is less the 751px
  * @callback SearchViewModel ~ onRequestBack
  */
  onSearchBackCallback() {
    this.showResults(!this.showResults());
    this.showItem(false);
  }

  /**
  * Called when the "Back to results" link is pressed
  * Hides the mainMarker and items panel
  * @callback ItemViewModel ~ onRequestBack
  */
  onBackCallback() {
    this.showResults(true);
    this.showItemPanel(false);
    this.hideMainMarker();
  }

  /**
  * Called when an item from the results list is clicked or when a marker
  * is pressed
  * @callback ResultsViewModel ~ onRequestItem
  * @param {object} item - The item object that was clicked
  */
  onItemCallback(item) {

    // If true use the google api else use the zomate api
    if (this.type()) {
      googleDetailAPI(item.id, this.onDetailCallback, this.onErrorCallback);
    } else {
      zomatoDetailAPI(item.id, this.onDetailCallback, this.onErrorCallback);
    }
    this.showMainMarker(item.geometry.location);
    this.mainMarker.setAnimation(google.maps.Animation.BOUNCE);
    mapSingleton.getMap().panTo(item.geometry.location);
    this.fetching(true);

  }

  /**
  * Called when the mouse enters a item on the results list
  * @callback ResultsViewModel ~ onRequestIn
  * @param {object} item - The item that the mouse entered
  */
  onItemMouseIn(item){
    this.showMainMarker(item.geometry.location);
  }

  /**
  * Called when the mouse leaves a item on the results list
  * @callback ResultsViewModel ~ onRequestOut
  */
  onItemMouseOut() {
    this.hideMainMarker();
  }

  /**
  * Called when a search api call has finished succesfully
  * @callback googleSearchAPI, zomatoSearchAPI ~ success
  * @param {array} results - An array of place results
  */
  onSearchCallback(places) {
    let bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      place.onRequestClick = this.onItemCallback;
      place.createMarker();
      bounds.extend(place.geometry.location);
    });

    // if results is not empty fit the map so should the markers
    if (places.length > 0) {
      mapSingleton.getMap().fitBounds(bounds);
    }
    ko.utils.arrayPushAll(this.results, places);
    this.fetching(false);
    this.showResults(true);
    this.showItemPanel(false);
  }

  /**
  * Called when a detail api call has finished succesfully
  * @callback googleDetailAPI, zomatoDetailAPI ~ success
  * @param {object} detail - the detail object return from the api
  */
  onDetailCallback(place) {
    this.place(place);
    this.showResults(false);
    this.showItemPanel(true);
    this.fetching(false);
  }

  /**
  * Called whe the google geo coder api has finished succesfully
  * @callback googleGeoCoder ~ success
  * @param {object} result - The place result from the address found
  */
  onGeoCallback(result) {
    this.addMarker(result);
  }

  /**
  * The callback that handles all the errors
  * @callback
  * @param {string} error - The error to display
  */
  onErrorCallback(error) {
    if (this.error().length == 0) {
      // Shows the error div for 5s
      setTimeout(() => this.error(''), 5000);
    }
    this.fetching(false);
    this.error(error);
  }
}
