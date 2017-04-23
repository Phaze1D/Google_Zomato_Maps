import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { searchTextRequest, googlePlaceDetailRequest } from 'actions/action';




@component({
  name: 'google-map',
  template: require('./view.html')
})
class GoogleMapController {
  constructor(params) {
    this.showMap = ko.observable(false);
    this.fetching = ko.observable(false);
    this.place = ko.observable({});
    this.results = ko.observableArray();
    mapSingleton.load(this.onMapLoadCallback.bind(this));

    this.onSearchSubmitCallback = this.onSearchSubmitCallback.bind(this);
    this.onSearchResetCallback = this.onSearchResetCallback.bind(this);
    this.onItemCallback = this.onItemCallback.bind(this);
    this.onItemBackCallback = this.onItemBackCallback.bind(this);
    this.onSearchTextCallback = this.onSearchTextCallback.bind(this);
    this.onGoogleItemCallback = this.onGoogleItemCallback.bind(this);
  }

  showResults(show){
    var resultsWrap = document.getElementById('results-wrapper');
    resultsWrap.classList[show ? 'add' : 'remove']('show');
  }

  showItem(show){
    var itemsWrap = document.getElementById('item-wrapper');
    itemsWrap.classList[show ? 'add' : 'remove']('show');
    document.getElementById('autocomplete-wrapper').style.top = show ? "80px" : '';
  }

  handleError(){

  }

  onMapLoadCallback(){
    this.showMap(true);
  }

  onSearchSubmitCallback(value){
    var params = {
      keyword: value.main + (value.sub ? ", " + value.sub : ''),
      location: mapSingleton.getCenter(),
      radius: 2000
    };
    this.fetching(true);
    searchTextRequest(params, this.onSearchTextCallback);
    this.results.removeAll();
  }

  onSearchResetCallback(){
    this.showResults(false);
    this.showItem(false);
  }

  onItemCallback(data){
    this.fetching(true);
    googlePlaceDetailRequest({placeId: data.place_id}, this.onGoogleItemCallback)
  }

  onItemBackCallback(){
    this.showResults(true);
    this.showItem(false);
  }

  onSearchTextCallback(results, status){
    for (var i = 0; i < results.length; i++) {
      this.results.push({
        place_id: results[i].place_id,
        title: results[i].name,
        rating: results[i].rating,
        type: results[i].types ? results[i].types[0].replace("_", " ") : '',
        address: results[i].vicinity,
        open: results[i].opening_hours ? results[i].opening_hours.open_now : false,
        picture: results[i].photos ? results[i].photos[0].getUrl({'maxWidth': 160, 'maxHeight': 160}) : 'https://maps.gstatic.com/tactile/omnibox/list-result-no-thumbnail-1x.png',
      })
    }
    this.fetching(false);
    this.showResults(true);
    this.showItem(false);
  }

  onGoogleItemCallback(place, status){
    place.type = place.types ? place.types[0].replace("_", " ") : '';
    place.photo = place.photos ? place.photos[0].getUrl({'maxWidth': 400}) : 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png';
    place.open = place.opening_hours ? place.opening_hours.open_now : false
    this.place(place);
    this.showResults(false);
    this.showItem(true);
    this.fetching(false);
  }
}
