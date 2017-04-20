import ko from 'knockout';
import { component } from 'utils/decorators';


@component({
  name: 'fab',
  template: require('./view.html')
})
class FABController {
  constructor(params) {
    this.classes = "fab-wrapper " + params.className
    this.icon = params.icon
  }
}
