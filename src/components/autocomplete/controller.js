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
    var value = data.main;
    value += data.sub && data.sub.length > 0 ? `, ${data.sub}` : '';
    this.onRequestItem(value);
  }
}
