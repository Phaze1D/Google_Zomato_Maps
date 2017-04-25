import ko from 'knockout';
import { component } from 'utils/decorators';


import { fakeResult } from '../../../fake.js';



@component({
  name: 'item',
  template: require('./view.html')
})
class ItemController {
  constructor(params) {
    this.place = params.place;
    this.show = params.show;
    this.over = false

    this.onRequestBack = params.onRequestBack
  }

  handleScroll(data, event) {
    if(event.target.scrollTop > event.target.clientHeight * 0.3 && !this.over){
      document.getElementById('item-search-background').style.opacity = "1"
      this.over = true
    }
    if(event.target.scrollTop < event.target.clientHeight * 0.3 && this.over) {
      document.getElementById('item-search-background').style.opacity = "0"
      this.over = false
    }
  }

  handleBack(data, event) {
    this.onRequestBack()
  }
}
