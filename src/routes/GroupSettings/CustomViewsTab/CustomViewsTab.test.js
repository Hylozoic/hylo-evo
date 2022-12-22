import CustomViewsTab from './CustomViewsTab'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

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
    expect(wrapper.find('.save-button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('.save-button').prop('color')).toEqual('green')
  })
})
