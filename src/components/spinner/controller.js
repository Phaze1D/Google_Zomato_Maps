import { component } from 'utils/decorators';


@component({
  name: 'spinner',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents the Spinner */
class SpinnerViewModel {

  /**
  * @constructor SpinnerViewModel
  * @param {string} classes - The classes to added
  * @param {number} width - The spinner width
  * @param {numbe} strokeWidth - The spinner strokeWidth
  */
  constructor(params) {
    this.classes = "loader " + params.classes;
    this.width = params.width ? `${params.width}px` : '100px';
    this.strokeWidth = params.strokeWidth ? params.strokeWidth : 3;
  }
}
