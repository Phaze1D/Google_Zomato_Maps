import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { googleAutocompleteAPI } from 'utils/google_tools';


@component({
  name: 'search-input',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents the Search Bar */
class SearchViewModel {

  /**
  * @constructor SearchViewModel
  * @param {function} onRequestSubmit - Callback
  * @param {function} onRequestReset - Callback
  * @param {function} onRequestBack - Callback
  * @param {function} onRequestError - Callback
  * @param {observable} fetching - observable boolean
  *
  * @member {boolean} didSubmit
  * @member {observable} showHolder - observable boolean
  * @member {observable} showClear - observable boolean
  * @member {observable} showAuto - observable boolean
  * @member {observable} responsive - observable boolean
  * @member {observable} searchValue - observable string
  * @member {observableArray} autoList - observable array
  */
  constructor(params) {
    this.onRequestSubmit = params.onRequestSubmit;
    this.onRequestReset = params.onRequestReset;
    this.onRequestError = params.onRequestError;
    this.fetching = params.fetching;

    this.didSubmit = false;
    this.showHolder = ko.observable(false);
    this.showClear = ko.observable(true);
    this.showAuto = ko.observable(false);
    this.searchValue = ko.observable("pizza");

    // Binding event handlers
    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.onItemCallback = this.onItemCallback.bind(this);
    this.onAutoCallback = this.onAutoCallback.bind(this);

    // Initializing autoList
    var shis = JSON.parse(localStorage.getItem('searchHistory'));
    this.autoList = ko.observableArray(shis);

    // subscribing to searchValue
    this.searchValue.subscribe(this.handleInputChanged);

  }

  /**
  * Adds an item to the front of the autolist and if list is greater then
  * 5 removes the last item
  * @param {object} value - value to be added
  */
  addFront(value) {
    this.autoList.unshift(value);
    if (this.autoList().length > 5) {
      this.autoList.pop();
    }
  }

  /**
  * Adds an item to the back of the autolist and if list is greater then
  * 5 removes the first item
  * @param {object} value - value to be added
  */
  addBack(value) {
    this.autoList.push(value);
    if (this.autoList().length > 5) {
      this.autoList.shift();
    }
  }

  /**
  * Converts the search input value into an object
  * @param {string} value - search input value
  * @return {object}
  */
  convertValue(value) {
    value = value.split(/,(.+)/);
    value.length == 1 ? value.push('') : value;
    return {
      icon: 'schedule',
      main: value[0],
      sub: value[1],
      recent: true
    };
  }

  /**
  * Updates the localStorage with new value
  * @param {object} value - value to add to the localStorage
  */
  updateLocalStorage(value) {
    value.recent = true;
    var history =  JSON.parse(localStorage.getItem('searchHistory'));
    history ? history.unshift(value) : history = [value];
    if (history.length > 5) {
      history.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
    this.addFront(value);
  }

  /**
  * Resets the autoList array
  */
  resetHistory() {
    this.autoList.removeAll();
    var history =  JSON.parse(localStorage.getItem('searchHistory'));
    if (history) {
      for (var i = 0; i < history.length; i++) {
        this.addBack(history[i]);
      }
    }
  }

  /**
  * Click Event Handler
  * Handles the flip type and the back button press
  */
  handleFlip(root) {
    root.type(!root.type());
    this.showClear(false);
  }

  /**
  * Input Event Handler
  * Calls the google auto complete api
  * @param {string} newValue - The new search value
  */
  handleInputChanged(newValue) {
    this.didSubmit = false;
    if(newValue && newValue.trim().length > 0){
      googleAutocompleteAPI(newValue, this.onAutoCallback, this.onRequestError);
    }else{
      this.resetHistory();
    }
  }

  /**
  * Focus In Event Handler for the search input
  * @param {object} data
  * @param {object} event
  */
  handleFocusIn(data, event) {
    this.showClear(true);
    this.showHolder(false);
    this.showAuto(true);
  }

  /**
  * Focus Out Event Handler for the search input
  * @param {object} data
  * @param {object} event
  */
  handleFocusOut(data, event) {
    this.showClear(this.didSubmit);
    this.showHolder(event.target.value.length == 0);
    this.showAuto(false);
  }

  /**
  * Submit handler for the search input
  * @param {object} data - this
  * @param {boolean} createNew - whether or not to add value to localStorage
  * @param {object} ref - if an auto item was clicked the ref from that
  *  object is passed
  */
  handleSubmit(data, createNew=true, ref=null) {
    this.didSubmit = true;
    this.showAuto(false);
    this.showClear(true);
    document.getElementById('search-input').blur();

    if (this.searchValue() && this.searchValue().length > 0){
      var value = ref ? ref : this.convertValue(this.searchValue());
      this.onRequestSubmit(this.searchValue());

      if (createNew) {
        this.updateLocalStorage(value);
      }

    } else {
      this.onRequestReset();
    }
  }

  /**
  * Click event handler for the clear button
  * @param {object} data
  * @param {object} event
  */
  handleReset(data, event) {
    this.didSubmit = false;
    document.getElementById('search-input').blur();
    this.searchValue('');
    this.onRequestReset();
    this.showHolder(true);
  }

  /**
  * Called when an auto complete item is clicked
  * @callback AutoCompleteViewModel ~ onRequestItem
  * @param {object} value - The value object from the autocomplete list
  */
  onItemCallback(value) {
    var string = value.main;
    string += value.sub ? ', ' + value.sub : '';
    this.searchValue(string);
    this.handleSubmit(null, !value.recent, value);
  }

  /**
  * Called when the google autocomplete api is successful
  * Adds a new array to the autoList
  * @param {array} results - The results of the autocomplete api
  */
  onAutoCallback(results) {
    results.forEach((result) => {
      var icon = result.types ? 'place' : 'search';
      this.addFront({
        icon: icon,
        main: result.structured_formatting.main_text,
        sub: result.structured_formatting.secondary_text || '',
        recent: false,
        place_id: result.place_id
      });
    });
  }
}
