import React from 'react'
import { shallow } from 'enzyme'
import KeyControlledItemList from './KeyControlledItemList'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('KeyControlledItemList', () => {
  const defaultMinProps = {
    onChange: () => {},
    items: []
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <KeyControlledItemList {...{ ...defaultMinProps, ...props }} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with items)', () => {
    const props = {
      items: [
        {
          id: 1,
          name: 'one'
        },
        {
          id: 2,
          name: 'two'
        }
      ]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with items and renderListItem func)', () => {
    const props = {
      items: [
        {
          id: 1,
          title: 'one'
        },
        {
          id: 2,
          title: 'two'
        }
      ],
      renderListItem: ({ item }) => <span>{item.title}</span>
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })
})
