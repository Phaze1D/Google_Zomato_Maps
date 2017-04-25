import ko from 'knockout';
import { component } from 'utils/decorators';

import { fakeResult } from '../../../fake.js'

@component({
  name: 'results',
  template: require('./view.html')
})
class ResultsController {
  constructor(params) {
    this.onRequestItem = params.onRequestItem;
    this.onRequestIn = params.onRequestIn;
    this.onRequestOut = params.onRequestOut;
    this.results = params.results;
    this.fetching = params.fetching;

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleMouseIn = this.handleMouseIn.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleItemClick(data, event){
    this.onRequestItem(data)
  }

  handleMouseIn(data, event){
    this.onRequestIn(data);
  }

  handleMouseOut(data, event){
    this.onRequestOut(data);
  }
}
