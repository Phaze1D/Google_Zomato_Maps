import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { googleAutocompleteAPI } from 'utils/google_tools';



@component({
  name: 'search-input',
  template: require('./view.html')
})
class SearchController {
  constructor(params) {
    this.onRequestSubmit = params.onRequestSubmit;
    this.onRequestReset = params.onRequestReset;
    this.onRequestBack = params.onRequestBack;
    this.onErrorRequest = params.onErrorRequest;
    
    this.fetching = params.fetching;
    this.didSubmit = false;
    this.showHolder = ko.observable(true);
    this.showClear = ko.observable(true);
    this.showAuto = ko.observable(false);
    this.responsive = ko.observable(false);
    this.searchValue = ko.observable("");

    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.handleResize       = this.handleResize.bind(this);
    this.onItemCallback     = this.onItemCallback.bind(this);
    this.onAutoCallback     = this.onAutoCallback.bind(this);

    var shis = JSON.parse(localStorage.getItem('searchHistory'));
    this.autoList = ko.observableArray(shis);
    this.searchValue.subscribe(this.handleInputChanged);

    window.addEventListener('resize',this.handleResize)
  }

  addFront(value){
    this.autoList.unshift(value);
    if(this.autoList().length > 5){
      this.autoList.pop();
    }
  }

  addBack(value){
    this.autoList.push(value);
    if(this.autoList().length > 5){
      this.autoList.shift();
    }
  }

  convertValue(value){
    value = value.split(/,(.+)/);
    value.length == 1 ? value.push('') : value
    return {icon: 'schedule', main: value[0], sub: value[1], recent: true};
  }

  updateLocalStorage(value){
    value.recent = true;
    var history =  JSON.parse(localStorage.getItem('searchHistory'));
    history ? history.unshift(value) : history = [value];
    if(history.length > 5){
      history.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
    this.addFront(value);
  }

  resetHistory(){
    this.autoList.removeAll()
    var history =  JSON.parse(localStorage.getItem('searchHistory'));
    if(history){
      for (var i = 0; i < history.length; i++) {
        this.addBack(history[i])
      }
    }
  }

  handleResize(){
    if(window.innerWidth < 751 && !this.responsive() && this.didSubmit){
      this.responsive(true);
    }else if(window.innerWidth > 751 && this.responsive()){
      this.responsive(false);
    }
  }

  handleFlip(root){
    if(this.responsive()){
      this.onRequestBack();
    }else{
      root.type(!root.type());
      this.showClear(false);
    }
  }

  handleInputChanged(newValue){
    this.didSubmit = false;
    if(newValue && newValue.trim().length > 0){
      googleAutocompleteAPI(newValue, this.onAutoCallback, this.onErrorRequest);
    }else{
      this.resetHistory()
    }
  }

  handleFocusIn(data, event){
    this.showClear(true);
    this.showHolder(false);
    this.showAuto(true);
  }

  handleFocusOut(data, event){
    this.showClear(this.didSubmit);
    this.showHolder(event.target.value.length == 0);
    this.showAuto(false);
  }

  handleSubmit(data, createNew=true, ref=null){
    this.didSubmit = true;
    this.showAuto(false);
    this.showClear(true);
    document.getElementById('search-input').blur();

    if(this.searchValue() && this.searchValue().length > 0){
      var value = ref ? ref : this.convertValue(this.searchValue());
      this.onRequestSubmit(this.searchValue());

      if(window.innerWidth < 751){
        this.responsive(true);
      }

      if(createNew){
        this.updateLocalStorage(value);
      }

    }else{
      this.responsive(false);
      this.onRequestReset();
    }
  }

  handleReset(data, event){
    this.responsive(false);
    this.didSubmit = false;
    document.getElementById('search-input').blur();
    this.searchValue('')
    this.onRequestReset();
    this.showHolder(true);
  }

  onItemCallback(value){
    var string = value.main;
    string += value.sub ? ', ' + value.sub : ''
    this.searchValue(string);
    this.handleSubmit(null, !value.recent, value);
  }

  onAutoCallback(results){
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
