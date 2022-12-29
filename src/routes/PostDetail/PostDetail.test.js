import PostDetail from './PostDetail'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('PostDetail', () => {
  it('renders correctly', () => {
    const imageUrl = 'foo.jpg'
    const tags = ['singing', 'dancing']
    const details = 'the body of the post'
    const votesTotal = 7
    const routeParams = {
      slug: 'foo'
    }
    const myVote = true

    const post = {
      id: '91',
      attachments: [],
      imageUrl,
      tags,
      details,
      votesTotal,
      myVote,
      members: []
    }

    const wrapper = shallow(<PostDetail
      post={post}
      routeParams={routeParams}
      fetchPost={jest.fn()}
      voteOnPost={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })
})
