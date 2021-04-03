import React from 'react'
import { shallow } from 'enzyme'
import GroupButton from './GroupButton'

describe('GroupButton', () => {
  it('matches last snapshot', () => {
    const props = {
      group: {
        id: "53",
        name: "Backyard Birders",
        slug: "bb",
        memberCount: 11,
        avatarUrl: "https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png",
        network: "1"
      }
    }

    const wrapper = shallow(<GroupButton {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
