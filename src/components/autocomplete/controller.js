import ko from 'knockout';
import { component } from 'utils/decorators';


@component({
  name: 'autocomplete',
  template: require('./view.html')
})
class AutoComplete {
  constructor(params) {
    this.onRequestItem = params.onRequestItem;
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(data, event){
    var value = {
      icon: 'schedule',
      main: data.main,
      sub: data.sub,
      recent: data.recent,
      place_id: data.place_id
    };
    this.onRequestItem(value);
  }
}
