import ko from 'knockout'
import { component } from 'utils/decorators'


@component({
  name: 'search-input',
  template: require('./view.html')
})
class SearchController {
  constructor(params) {
    this.didSubmit = false;
    this.showHolder = ko.observable(true);
    this.showClear = ko.observable(true);
  }

  handleFocus(data, event){
    if(event.target.value.length > 0){
      this.showHolder(false);
      this.showClear( (event.type === 'focusin' || this.didSubmit)  )
    }else{
      this.showHolder(!this.showHolder());
    }
  }

  handleSubmit(data){
    this.showClear(true);
    this.didSubmit = true;
  }

  handleReset(data, event){
    this.didSubmit = false;
    var input = document.getElementById('search-input');
    input.value = ''
    input.blur()
    this.showHolder(true)
  }
}
