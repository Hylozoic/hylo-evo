import PropTypes from 'prop-types'
import { mount } from 'enzyme'

export function mockRouter () {
  return {
    history: {
      push: jest.fn(),
      replace: jest.fn(),
      createHref: jest.fn()
    }
  }
}

export function mockRouterMountOptions () {
  return {
    context: { router: mockRouter() },
    childContextTypes: { router: PropTypes.object }
  }
}

export function mountWithMockRouter (component) {
  return mount(component, mockRouterMountOptions())
}
