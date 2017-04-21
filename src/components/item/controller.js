import ko from 'knockout';
import { component } from 'utils/decorators';


import { fakeResult } from '../../../fake.js';



@component({
  name: 'item',
  template: require('./view.html')
})

class ItemController {
  constructor(params) {
    this.mainImage = 'http://lh5.googleusercontent.com/-58Hn-jVwMEk/WD9UjLx_4JI/AAAAAAAATqw/P0CXx6b8vrUrXUiyaUPdnEo07pzkFziSwCLIB/w455-h256-k-no/'

    this.result = fakeResult();
  }
}
