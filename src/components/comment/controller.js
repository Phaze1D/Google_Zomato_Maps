import { component } from 'utils/decorators';


@component({
  name: 'review-comment',
  template: require('./view.html')
})
/** KnockoutJS ViewModel that represents the comment section */
class CommentViewModel {

  /**
  * @constructor CommentController
  * @param {object} review - A single review object with properties
  * author_name, rating, text
  */
  constructor(params) {
    this.review = params.review;
  }
}
