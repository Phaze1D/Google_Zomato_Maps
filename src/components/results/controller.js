import ko from 'knockout';
import { component } from 'utils/decorators';

import { fakeResult } from '../../../fake.js'

@component({
  name: 'results',
  template: require('./view.html')
})
class ResultsController {
  constructor(params) {
    this.onRequestItem = params.onRequestItem
    this.results = params.results

    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick(data, event){
    this.onRequestItem()
  }
}
