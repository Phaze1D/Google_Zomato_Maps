import ko from 'knockout';
import { component } from 'utils/decorators';

import { fakeResult } from '../../../fake.js'

@component({
  name: 'results',
  template: require('./view.html')
})
class ResultsController {
  constructor(params) {
    this.results = []

    for (var i = 0; i < 10; i++) {
      this.results.push(fakeResult())
    }
  }

  handleItemClick(data, event){
    console.log(event);
  }
}
