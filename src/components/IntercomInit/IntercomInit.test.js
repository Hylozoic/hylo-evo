import IntercomInit from './IntercomInit'
import { shallow } from 'enzyme'
import React from 'react'
import { omit } from 'lodash/fp'

it('matches the last snapshot', () => {
  const props = {
    currentUser: {id: 123, email: 'jo@mo.com', intercomHash: 'abc'}
  }
  const wrapper = shallow(<IntercomInit {...props} />)
  const intercomProps = wrapper.find('Intercom').props()
  expect(omit('appID', intercomProps)).toMatchSnapshot()
})
