import Search from './Search'
import { shallow } from 'enzyme'
import React from 'react'

describe.skip('Search', () => {
  it('matches the latest snapshot', () => {
    const ct = [
      {
        id: '1',
        topic: {
          id: '2',
          name: 'petitions'
        },
        postsTotal: 24,
        followersTotal: 52,
        isSubscribed: false
      }
    ]
    const wrapper = shallow(<Search
      communityTopics={ct}
      slug='goteam'
      topicsTotal='10'
      toggleSubscribe={() => {}} />)

    expect(wrapper).toMatchSnapshot()
  })
})
