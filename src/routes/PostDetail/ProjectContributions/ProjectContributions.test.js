import React from 'react'
import { shallow, mount } from 'enzyme'
import ProjectContributions from './ProjectContributions'

describe('ProjectContributions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ProjectContributions
      postId={123}
      totalContributions={321}
      stripeKey='anything'
      processStripeToken={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('toggles expanded correctly', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      stripeKey='anything'
      processStripeToken={jest.fn()} />)
    wrapper.instance().toggleExpanded()
    expect(wrapper.instance().state.expanded).toBe(true)
  })

  it('renders received message', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      stripeKey='anything'
      processStripeToken={jest.fn()} />)
    wrapper.setState({ received: true })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders error message', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      stripeKey='anything'
      processStripeToken={jest.fn()} />)
    wrapper.setState({ error: true })
    expect(wrapper).toMatchSnapshot()
  })

  it('disables button on invalid amount', () => {
    const wrapper = mount(<ProjectContributions
      postId={123}
      totalContributions={321}
      stripeKey='anything'
      processStripeToken={jest.fn()} />)
    wrapper.setState({
      contributionAmount: '12fc',
      expanded: true
    })
    expect(wrapper).toMatchSnapshot()
  })
})
