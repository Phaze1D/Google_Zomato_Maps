import ko from 'knockout'

/**
* Decorator function that register a KnockoutJS Component
* @param {string} name - The name of the component
* @param {string} template - The path to the view file
*/
function component(params) {
  return function decorator(viewModel) {
    ko.components.register(params.name, {
      viewModel: viewModel,
      template: params.template
    })
  }
}

exports.component = component
