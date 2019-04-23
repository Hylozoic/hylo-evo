import ScrollListener from './ScrollListener'
import { shallow } from 'enzyme'
import React from 'react'

it('will call onLeaveTop', () => {
  const props = {
    element: {
      scrollTop: 1
    },
    onLeaveTop: jest.fn()
  }
  const wrapper = shallow(<ScrollListener {...props} />, { disableLifecycleMethods: true })
  const simEvent = {
    preventDefault: jest.fn()
  }
  wrapper.instance().handleScrollEvents(simEvent)
  expect(props.onLeaveTop).toHaveBeenCalled()
})

it('will call onTop', () => {
  const props = {
    element: {
      scrollTop: 0
    },
    onTop: jest.fn()
  }
  const wrapper = shallow(<ScrollListener {...props} />, { disableLifecycleMethods: true })
  wrapper.setState({ hitTop: false })
  const simEvent = {
    preventDefault: jest.fn()
  }
  wrapper.instance().handleScrollEvents(simEvent)
  expect(props.onTop).toHaveBeenCalled()
})
