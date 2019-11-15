import PostTopics from './PostTopics'
import { shallow } from 'enzyme'
import React from 'react'

describe('TopicsLine', () => {
  it('matches last snapshot', () => {
    const props = {
      topics: [{ name: 'one' }, { name: 'two' }],
      slug: 'hay',
      spacer: () => <span>.</span>
    }

    const wrapper = shallow(<PostTopics {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
