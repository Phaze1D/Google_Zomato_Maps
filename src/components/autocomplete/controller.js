import { component } from "utils/decorators";


@component({
  name: "autocomplete",
  template: require("./view.html")
})
/** KnockoutJS Component that represents the auto complete list */
class AutoComplete {

  /**
  * @constructor AutoComplete
  * @param {function} onRequestItem - function to call when item is clicked
  */
  constructor(params) {
    this.onRequestItem = params.onRequestItem;
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  /**
  * Click event handler for when an list item is click. Calls the onRequestItem
  * callback. Changes the data's icon to schedule to indicate user's history.
  * @param {object} data - The data corresponding to the item that was clicked
  * @param {object} event - Click event
  */
  handleItemClick(data, event){
    data.icon = "schedule";
    this.onRequestItem(data);
  }
}
