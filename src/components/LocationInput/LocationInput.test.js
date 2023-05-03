import React from 'react'
import { shallow } from 'enzyme'
import LocationInput from './LocationInput'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('LocationInput', () => {
  const defaultMinProps = {
    mapboxToken: ''
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <LocationInput {...{ ...defaultMinProps, ...props }} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with some default props', () => {
    const wrapper = renderComponent(shallow, { location: '123 main st. San Francisco, CA' })
    expect(wrapper).toMatchSnapshot()
  })
})
