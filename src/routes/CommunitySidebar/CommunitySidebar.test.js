import
  CommunitySidebar,
  { AboutSection,
    MemberSection,
    CommunityLeaderSection,
    CommunityLeader
  } from './CommunitySidebar'
import { shallow } from 'enzyme'
import React from 'react'
import { fakePerson } from 'components/PostCard/samplePost'

const community = {
  id: 1,
  name: 'A Great Cause',
  slug: 'great-cause',
  description: 'the description'
}

describe('CommunitySidebar', () => {
  it('renders correctly', () => {
    const members = [{id: 1}, {id: 2}, {id: 3}]
    const leaders = [{id: 4}, {id: 5}, {id: 6}]
    const membersTotal = 56
    const wrapper = shallow(
      <CommunitySidebar
        community={community}
        members={members}
        membersTotal={membersTotal}
        leaders={leaders} />)
    expect(wrapper.find('AboutSection').prop('description')).toEqual(community.description)
    expect(wrapper.find('MemberSection').prop('members')).toEqual(members)
    expect(wrapper.find('MemberSection').prop('membersTotal')).toEqual(membersTotal)
    expect(wrapper.find('CommunityLeaderSection').prop('leaders')).toEqual(leaders)
    expect(wrapper.find('CommunityLeaderSection').prop('slug')).toEqual(community.slug)
  })
})

describe('AboutSection', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <AboutSection
        name={community.name}
        description={community.description} />)
    expect(wrapper.find('div').at(1).text()).toEqual(`About ${community.name}`)
    expect(wrapper.find('div').at(2).text()).toEqual(community.description)
    expect(wrapper.find('span').at(0).text()).toEqual('Read More')
    wrapper.setState({expanded: true})
    expect(wrapper.find('span').at(0).text()).toEqual('Show Less')
  })
})

describe('MemberSection', () => {
  const n = 8
  const members = fakePerson(n)

  it("Doesn't show total if it's < 1", () => {
    const wrapper = shallow(<MemberSection members={members} membersTotal={n} />)
    expect(wrapper.find('RoundImageRow').length).toEqual(1)
    expect(wrapper.find('span').length).toEqual(0)
  })

  it("Formats total correctly if it's > 999", () => {
    const wrapper = shallow(<MemberSection members={members} membersTotal={5600} />)
    expect(wrapper.find('RoundImageRow').length).toEqual(1)
    expect(wrapper.find('span').text()).toEqual('+5.6k')
  })
})

describe('CommunityLeaderSection', () => {
  it('renders correctly', () => {
    const n = 5
    const leaders = fakePerson(n)
    const wrapper = shallow(<CommunityLeaderSection leaders={leaders} />)
    expect(wrapper.find('CommunityLeader').length).toEqual(n)
    expect(wrapper.find('CommunityLeader').at(1).prop('leader')).toEqual(leaders[1])
  })
})

describe('CommunityLeader', () => {
  it('renders correctly', () => {
    const leader = {
      id: 1,
      name: 'Jon Smith',
      avatarUrl: 'foo.png'
    }
    const wrapper = shallow(<CommunityLeader leader={leader} />)
    expect(wrapper.find('Avatar').prop('avatarUrl')).toEqual(leader.avatarUrl)
    expect(wrapper.find('Link').get(0).props.children).toEqual(leader.name)
  })
})
