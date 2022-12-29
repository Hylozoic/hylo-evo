import React from 'react'
import { shallow } from 'enzyme'
import Events from './Events'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('Events', () => {
  it('renders a post list', () => {
    const posts = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = shallow(<Events
      currentUser={{ id: 1 }}
      posts={posts}
      fetchEvents={jest.fn()}
      timeframe='future'
      currentUserHasMemberships
    />)
    expect(wrapper.find('Connect(PostCard)').length).toEqual(3)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays the regular StreamBanner', () => {
    const props = {
      currentUser: { id: 1 },
      posts: [],
      timeframe: 'future',
      fetchEvents: jest.fn()
    }
    const wrapper = shallow(<Events {...props} />)
    expect(wrapper.find('StreamBanner')).toHaveLength(1)
  })
})
