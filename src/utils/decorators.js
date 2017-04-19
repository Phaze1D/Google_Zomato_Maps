import ko from 'knockout'

function component(params) {
  return function decorator(viewModel) {
    ko.components.register(params.name, {
      viewModel: viewModel,
      template: params.template
    })
  }
}

exports.component = component
