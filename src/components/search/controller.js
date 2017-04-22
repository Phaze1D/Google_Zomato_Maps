import ko from 'knockout';
import { component } from 'utils/decorators';
import { mapSingleton } from 'utils/map';
import { autoCompleteRequest } from 'actions/action';



@component({
  name: 'search-input',
  template: require('./view.html')
})
class SearchController {
  constructor(params) {
    this.onRequestSubmit = params.onRequestSubmit;
    this.onRequestReset = params.onRequestReset;
    this.fetching = params.fetching
    this.didSubmit = false;
    this.showHolder = ko.observable(true);
    this.showClear = ko.observable(true);
    this.showAuto = ko.observable(false);
    this.searchValue = ko.observable("");
    this.autoList = ko.observableArray();


    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.onItemCallback = this.onItemCallback.bind(this);
    this.onAutoRequestCallback = this.onAutoRequestCallback.bind(this);

    var shis = JSON.parse(localStorage.getItem('searchHistory'));
    this.autoList = ko.observableArray(shis);

    this.searchValue.subscribe(this.handleInputChanged)
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

  handleInputChanged(newValue){
    this.didSubmit = false;
    var params = {
      input: newValue,
      location: mapSingleton.getCenter(),
      radius: 2000
    };
    if(newValue && newValue.trim().length > 0){
      autoCompleteRequest(params, this.onAutoRequestCallback);
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
      this.onRequestSubmit(value);

      if(createNew){
        this.updateLocalStorage(value);
      }

    }else{
      this.onRequestReset();
    }
  }

  handleReset(data, event){
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

  onAutoRequestCallback(array, status){
    if(status === 'OK'){
      for (var i = 0; i < array.length; i++) {
        var icon = 'place'
        if(!array[i].types){
          icon = 'search'
        }
        this.addFront({
          icon: icon,
          main: array[i].structured_formatting.main_text,
          sub: array[i].structured_formatting.secondary_text || '',
          recent: false,
          place_id: array[i].place_id
        })
      }
    }else{
      console.log(status);
    }
  }
}
