import React from 'react'
import { shallow } from 'enzyme'
import Drawer, { GroupRow, NetworkRow } from './Drawer'

const groups = [
  {
    id: '11', slug: 'foo', name: 'Foomunity', avatarUrl: '/foo.png', newPostCount: 0
  },
  {
    id: '22', slug: 'bar', name: 'Barmunity', avatarUrl: '/bar.png', newPostCount: 7
  }
]

const networks = [
  {
    id: '1',
    name: 'Wombat Network',
    avatarUrl: '/wombat.png',
    groups
  }
]

const match = {
  match: {
    params: 'c'
  }
}

describe('Drawer', () => {
  it('renders with a current group', () => {
    const wrapper = shallow(<Drawer
      match={match}
      group={groups[0]}
      groups={groups}
      networks={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without a current group', () => {
    const wrapper = shallow(<Drawer groups={groups} networks={[]} match={match}/>)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a group list if networks are present', () => {
    const wrapper = shallow(<Drawer groups={groups} networks={networks} match={match} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('GroupRow', () => {
  it('renders with zero new posts', () => {
    const wrapper = shallow(<GroupRow group={groups[0]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const wrapper = shallow(<GroupRow group={groups[0]} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('NetworkRow', () => {
  const defaultProps = {
    network: {
      name: 'Network One',
      slug: 'none',
      avatarUrl: 'foo.png',
      groups: [
        {
          id: 1,
          newPostCount: 7
        },
        {
          id: 2,
          newPostCount: 6
        }
      ]
    }
  }

  it('matches last snapshot', () => {
    const wrapper = shallow(<NetworkRow {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.state('expanded')).toEqual(true)
  })

  it('is not expanded when post counts are 0', () => {
    const props = {
      ...defaultProps,
      groups: [
        { id: 1, newPostCount: 0 },
        { id: 2, newPostCount: 0 }
      ]
    }
    const wrapper = shallow(<NetworkRow {...props} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.state('expanded')).toEqual(true)
  })

  describe('toggleExpanded', () => {
    it('calls preventDefault and sets the state', () => {
      const wrapper = shallow(<NetworkRow {...defaultProps} />)
      const e = {
        preventDefault: jest.fn()
      }
      wrapper.instance().toggleExpanded(e)
      expect(wrapper.state('expanded')).toEqual(false)
      expect(e.preventDefault).toHaveBeenCalled()
    })
  })

  describe('see all button', () => {
    const seeAllProps = {
      network: {
        ...defaultProps.network,
        nonMemberGroups: [
          {
            id: 3,
            name: 'non member 1'
          }
        ]
      }
    }

    it('shows "see all" button when there are non member groups', () => {
      const wrapper = shallow(<NetworkRow {...seeAllProps} />)
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.state('expanded')).toEqual(true)
    })

    it('calls preventDefault and sets the state', () => {
      const wrapper = shallow(<NetworkRow {...seeAllProps} />)
      const e = {
        preventDefault: jest.fn()
      }

      expect(wrapper).toMatchSnapshot()
      expect(wrapper.state('seeAllExpanded')).toEqual(false)
      expect(wrapper.find(GroupRow).length).toEqual(2)
      expect(wrapper.find('[data-stylename="s.seeAllBtn"]').text()).toEqual('See all')
      wrapper.instance().toggleSeeAll(e)
      wrapper.update()
      expect(wrapper.state('seeAllExpanded')).toEqual(true)
      expect(wrapper.find(GroupRow).length).toEqual(3)
      expect(wrapper.find('[data-stylename="s.seeAllBtn"]').text()).toEqual('See less')
      expect(e.preventDefault).toHaveBeenCalled()
    })
  })
})
