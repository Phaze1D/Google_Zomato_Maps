import ko from 'knockout';
import { component } from 'utils/decorators';


@component({
  name: 'search-input',
  template: require('./view.html')
})
class SearchController {
  constructor(params) {
    this.didSubmit = false;
    this.showHolder = ko.observable(true);
    this.showClear = ko.observable(true);
    this.showAuto = ko.observable(false);
    this.autoList = ko.observableArray();

    this.onItemCallback = this.onItemCallback.bind(this);

    var shis = JSON.parse(localStorage.getItem('searchHistory'));
    this.autoList = ko.observableArray(shis);
  }

  addValue(value){
    this.autoList.unshift(value);
    if(this.autoList().length > 5){
      this.autoList.pop();
    }
  }

  convertValue(value){
    value = value.split(',', 1);
    value.length == 1 ? value.push('') : value
    return {icon: 'schedule', main: value[0], sub: value[1]};
  }

  updateLocalStorage(value){
    var history =  JSON.parse(localStorage.getItem('searchHistory'));
    history ? history.unshift(value) : history = [value];
    if(history.length > 5){
      history.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }

  handleFocusIn(data, event){
    this.showClear(true);
    this.showHolder(false);
    this.showAuto(this.autoList().length > 0);
  }

  handleFocusOut(data, event){
    this.showClear(this.didSubmit);
    this.showHolder(event.target.value.length == 0);
    this.showAuto(false);
  }

  handleOnChange(data, event){
    this.didSubmit = false;
  }

  handleSubmit(data, createNew=true){
    this.didSubmit = true;
    this.showAuto(false);
    this.showClear(true);
    var input = document.getElementById('search-input');
    input.blur();
    if(createNew){
      var value = this.convertValue(input.value);
      this.updateLocalStorage(value);
      this.addValue(value);
    }
  }

  handleReset(data, event){
    this.didSubmit = false;
    var input = document.getElementById('search-input');
    input.value = '';
    input.blur();
    this.showHolder(true);
  }

  onItemCallback(value){
    document.getElementById('search-input').value = value;
    this.handleSubmit(null, false);
  }
}
