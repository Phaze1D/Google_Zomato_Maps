import { component } from 'utils/decorators';


@component({
  name: 'item',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents the Item Panel */
class ItemViewModel {

  /**
  * @constructor ItemViewModel
  * @param {object} place - The place details to display
  * @param {boolean} show - Whether to show the panel or not
  * @param {function} onRequestBack - The callback called when the back link
  * @member {boolean} over - whether user has scrolled over the cover image
  */
  constructor(params) {
    this.place = params.place;
    this.show = params.show;
    this.over = false;

    this.onRequestBack = params.onRequestBack;
  }

  /**
  * Scroll Event handler for the item panel. Changes the background color
  * of search bar
  * @param {object} data
  * @param {object} event - scroll event
  */
  handleScroll(data, event) {
    if (event.target.scrollTop > event.target.clientHeight * 0.3 && !this.over) {
      document.getElementById('item-search-background').style.opacity = "1";
      this.over = true;
    }
    if (event.target.scrollTop < event.target.clientHeight * 0.3 && this.over) {
      document.getElementById('item-search-background').style.opacity = "0";
      this.over = false;
    }
  }

  /**
  * Click Event handler for when the return to results link is pressed
  * @param {object} data
  * @param {object} event - click event
  */
  handleBack(data, event) {
    event.preventDefault();
    this.onRequestBack();
  }
}
