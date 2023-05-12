import React from 'react'
import PostGroups from './PostGroups'
import { shallow } from 'enzyme'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('PostGroups', () => {
  it('matches last snapshot', () => {
    const props = {
      groups: [
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

    const wrapper = shallow(<PostGroups {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot when expanded', () => {
    const props = {
      groups: [
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
    const wrapper = shallow(<PostGroups {...props} />)
    wrapper.instance().toggleExpanded()
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('returns null when in the only group', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      slug: 'one'
    }

    const wrapper = shallow(<PostGroups {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
