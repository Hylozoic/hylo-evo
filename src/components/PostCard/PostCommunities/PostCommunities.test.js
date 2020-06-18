import React from 'react'
import PostCommunities from './PostCommunities'
import { shallow } from 'enzyme'

describe('PostCommunities', () => {
  it('matches last snapshot', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        },
        {
          id: 3,
          name: 'Three',
          slug: 'three'
        }
      ],
      slug: 'hylo'
    }

    const wrapper = shallow(<PostCommunities {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot when expanded', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        },
        {
          id: 3,
          name: 'Three',
          slug: 'three'
        }
      ],
      slug: 'hylo'
    }
    const wrapper = shallow(<PostCommunities {...props} />)
    wrapper.instance().toggleExpanded()
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('returns null when in the only community', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      slug: 'one'
    }

    const wrapper = shallow(<PostCommunities {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
