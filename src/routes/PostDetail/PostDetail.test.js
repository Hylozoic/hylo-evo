import PostDetail, { ProjectContributions } from './PostDetail'
import { shallow, mount } from 'enzyme'
import React from 'react'

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

describe('ProjectContributions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ProjectContributions
      postId={123}
      totalContributions={321}
      processStripeToken={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('toggles expanded correctly', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      processStripeToken={jest.fn()} />)
    wrapper.instance().toggleExpanded()
    expect(wrapper.instance().state.expanded).toBe(true)
  })

  it('renders received message', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      processStripeToken={jest.fn()} />)
    wrapper.setState({received: true})
    expect(wrapper).toMatchSnapshot()
  })

  it('renders error message', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      processStripeToken={jest.fn()} />)
    wrapper.setState({error: true})
    expect(wrapper).toMatchSnapshot()
  })

  it('disables button on invalid amount', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      processStripeToken={jest.fn()} />)
    wrapper.setState({
      contributionAmount: '12fc',
      expanded: true
    })
    expect(wrapper).toMatchSnapshot()
  })
})
