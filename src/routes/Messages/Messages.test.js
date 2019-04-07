import React from 'react'
import { shallow } from 'enzyme'
import Messages from './Messages'

const testProps = {
  fetchMessages: () => {},
  createMessage: () => {},
  match: {
    params: {
      threadId: '1'
    }
  }
}
 
it('matches the last snapshot', () => {
  const wrapper = shallow(<Messages {...testProps}  />, { disableLifecycleMethods: true })

  expect(wrapper).toMatchSnapshot()
})
