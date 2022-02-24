import
GroupSidebar,
{ AboutSection,
  MemberSection,
  GroupLeaderSection,
  GroupLeader
} from './GroupSidebar'
import { shallow } from 'enzyme'
import React from 'react'
import faker from '@faker-js/faker'
import { fakePerson } from 'util/testData'

const group = {
  id: 1,
  name: 'A Great Cause',
  slug: 'great-cause',
  description: 'the description, which is long enough to add a "Read More" button, ' +
    'the description, which is long enough to add a "Read More" button, ' +
    'the description, which is long enough to add a "Read More" button, ' +
    'the description, which is long enough to add a "Read More" button, ' +
    'the description, which is long enough to add a "Read More" button, '
}

describe('GroupSidebar', () => {
  const members = [{ id: 1 }, { id: 2 }, { id: 3 }]
  const leaders = [{ id: 4 }, { id: 5 }, { id: 6 }]
  const memberCount = 56
  const currentUser = { canModerate: () => true }

  it('renders correctly', () => {
    const wrapper = shallow(
      <GroupSidebar
        group={{ ...group, memberCount }}
        currentUser={currentUser}
        members={members}
        leaders={leaders} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('AboutSection', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <AboutSection
        name={group.name}
        description={group.description} />)
    expect(wrapper.find('div').at(1).text()).toEqual(`About ${group.name}`)
    expect(wrapper.find('span').at(1).text()).toEqual('Read More')
    wrapper.setState({ expanded: true })
    expect(wrapper.find('span').at(1).text()).toEqual('Show Less')
  })
})

describe('MemberSection', () => {
  faker.seed(33)
  const n = 8
  const members = fakePerson(n)

  it("Doesn't show total if it's < 1", () => {
    const wrapper = shallow(<MemberSection
      slug={'foo'}
      members={members}
      memberCount={n}
      canModerate />)
    expect(wrapper).toMatchSnapshot()
  })

  it("Formats total correctly if it's > 999", () => {
    const wrapper = shallow(<MemberSection
      slug={'foo'}
      members={members}
      memberCount={5600} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Shows invite link if canModerate is true', () => {
    const wrapper = shallow(<MemberSection
      slug={'foo'}
      members={members}
      memberCount={5600}
      canModerate />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('GroupLeaderSection', () => {
  it('renders correctly', () => {
    const n = 5
    const leaders = fakePerson(n)
    const wrapper = shallow(<GroupLeaderSection leaders={leaders} />)
    expect(wrapper.find('GroupLeader').length).toEqual(n)
    expect(wrapper.find('GroupLeader').at(1).prop('leader')).toEqual(leaders[1])
  })
})

describe('GroupLeader', () => {
  it('renders correctly', () => {
    const leader = {
      id: 1,
      name: 'Jon Smith',
      avatarUrl: 'foo.png'
    }
    const wrapper = shallow(<GroupLeader leader={leader} />)
    expect(wrapper.find('Avatar').prop('avatarUrl')).toEqual(leader.avatarUrl)
    expect(wrapper.find('Link').get(0).props.children).toEqual(leader.name)
  })
})
