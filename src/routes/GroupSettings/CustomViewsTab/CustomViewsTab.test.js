import CustomViewsTab from './CustomViewsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('CustomViewsTab', () => {
  it('renders correctly', () => {
    const group = {
      id: 1,
      name: 'Foomunity',
      slug: 'foo',
      locationObject: 'Fuji',
      description: 'Great group',
      avatarUrl: 'avatar.png',
      bannerUrl: 'avatar.png',
      customViews: [{
        activePostsOnly: false,
        externalLink: 'https://google.com',
        icon: 'Public',
        isActive: true,
        name: 'custommm baby',
        order: 1,
        postTypes: [],
        topics: [],
        type: 'externalLink'
      }]
    }
    const wrapper = shallow(<CustomViewsTab group={group} fetchCollectionPosts={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Button[label="Save Changes"]').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button[label="Save Changes"]').prop('color')).toEqual('green')
  })
})
