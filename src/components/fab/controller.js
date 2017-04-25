import { component } from 'utils/decorators';


@component({
  name: 'fab',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents a Floating Action Button */
class FABViewModel {

  /**
  * @constructor FABViewModel
  * @param {string} className - The class names to be added in addition
  * to the default
  * @param {string} icon - The material design icon to use
  * @param {function} onClick - The click event handler
  */
  constructor(params) {
    this.classes = "fab-wrapper " + params.className;
    this.icon = params.icon;
    this.onClick = params.onClick;
  }
}
