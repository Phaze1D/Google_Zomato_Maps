import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { searchTextRequest } from 'actions/action'




@component({
  name: 'google-map',
  template: require('./view.html')
})
class GoogleMapController {
  constructor(params) {
    this.showMap = ko.observable(false);
    this.fetching = ko.observable(false);
    this.results = ko.observableArray();
    mapSingleton.load(this.onMapLoadCallback.bind(this));

    this.onSearchSubmitCallback = this.onSearchSubmitCallback.bind(this);
    this.onSearchResetCallback = this.onSearchResetCallback.bind(this);
    this.onItemCallback = this.onItemCallback.bind(this);
    this.onItemBackCallback = this.onItemBackCallback.bind(this);
    this.onSearchTextCallback = this.onSearchTextCallback.bind(this);
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

  onItemCallback(){
    this.showResults(false);
    this.showItem(true);
  }

  onItemBackCallback(){
    this.showResults(true);
    this.showItem(false);
  }

  onSearchTextCallback(results, status){
    console.log(results);
    this.fetching(false)
    this.showResults(true);
    this.showItem(false);
    for (var i = 0; i < results.length; i++) {
      this.results.push({
        title: results[i].name,
        review: results[i].rating,
        type: results[i].types ? results[i].types[0] : '',
        address: results[i].vicinity,
        open: results[i].opening_hours ? results[i].opening_hours.open_now : false,
        picture: results[i].photos ? results[i].photos[0].getUrl({'maxWidth': 160, 'maxHeight': 160}) : '',
      })
    }
  }
}
