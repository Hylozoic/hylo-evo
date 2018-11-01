import React from 'react'
import PostCommunities, { CommunityList, CommunityRow, CommunityCell } from './PostCommunities'
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

describe('CommunityList', () => {
  it('matches last snapshot with 1 community', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<CommunityList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot with 2 communities', () => {
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
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<CommunityList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot with 5 community', () => {
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
        },
        {
          id: 4,
          name: 'Four',
          slug: 'four'
        },
        {
          id: 5,
          name: 'Five',
          slug: 'five'
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<CommunityList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityRow', () => {
  it('matches last snapshot with 1 community', () => {
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
        }
      ]
    }

    const wrapper = shallow(<CommunityRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityCell', () => {
  it('matches last snapshot with 1 community', () => {
    const props = {
      community: [
        {
          id: 1,
          name: 'One',
          slug: 'one',
          avatarUrl: 'one.png'
        }
      ]
    }

    const wrapper = shallow(<CommunityCell {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
