import ko from 'knockout';
import { component } from 'utils/decorators';


@component({
  name: 'spinner',
  template: require('./view.html')
})
class SpinnerController {
  constructor(params) {
    this.width = params.width ? `${params.width}px` : '100px';
    this.strokeWidth = params.strokeWidth ? params.strokeWidth : 3;
  }
}
