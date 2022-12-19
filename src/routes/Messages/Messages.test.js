import React from 'react'
import { shallow } from 'enzyme'
import Messages from './Messages'
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

const testProps = {
  fetchMessages: () => {},
  createMessage: () => {},
  match: {
    params: {
      threadId: '1'
    }
  }
}

it('renders loading when in loading state', () => {
  const wrapper = shallow(<Messages {...testProps} />, { disableLifecycleMethods: true })
  wrapper.setState({ loading: true })

  expect(wrapper).toMatchSnapshot()
})

it('renders entire component when not loading', () => {
  const wrapper = shallow(<Messages {...testProps} />, { disableLifecycleMethods: true })
  wrapper.setState({ loading: false })

  expect(wrapper).toMatchSnapshot()
})
