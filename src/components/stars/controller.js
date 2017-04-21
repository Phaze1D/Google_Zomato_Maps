import ko from 'knockout';
import { component } from 'utils/decorators';



@component({
  name: 'stars',
  template: require('./view.html')
})
class StarsController {
  constructor(params) {
    this.total = params.total ? params.total : 5;
    this.review = params.review;
    this.className = params.className;

  }
}


ko.components.register('star-svg', {
  template:
    `
    <!--  Taken from http://codepen.io/nossie/pen/dMrKLQ -->
    <svg style="display:none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
      <defs>
        <g id="icon-star">
          <path class="full" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
          l11.547-1.2L16.026,0.6L20.388,10.918z"></path>
        </g>
        <g id="empty-star">
          <path class="empty" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
          l11.547-1.2L16.026,0.6L20.388,10.918z"></path>
        </g>
      </defs>
    </svg>
    <!--  Taken from http://codepen.io/nossie/pen/dMrKLQ -->
    `
})
