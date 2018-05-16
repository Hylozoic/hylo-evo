import IntercomInit from './IntercomInit'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const props = {
    currentUser: {id: 123, email: 'jo@mo.com', intercomHash: 'abc'}
  }
  const wrapper = shallow(<IntercomInit {...props} />)
  expect(wrapper).toMatchSnapshot()
})
