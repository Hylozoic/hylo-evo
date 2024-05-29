import
GroupSidebar,
{
  MemberSection,
  GroupLeaderSection,
  GroupLeader
} from './GroupSidebar'
// import AboutSection from './AboutSection'
import { shallow } from 'enzyme'
import React from 'react'
import faker from '@faker-js/faker'
import { fakePerson } from 'util/testing/testData'

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

const responsibilities = ['RESP_ADD_MEMBERS', 'RESP_ADMINISTRATION', 'RESP_REMOVE_MEMBERS']

describe('GroupSidebar', () => {
  const members = [{ id: 1 }, { id: 2 }, { id: 3 }]
  const leaders = [{ id: 4 }, { id: 5 }, { id: 6 }]
  const memberCount = 56
  const currentUser = { memberships: { toRefArray: () => [{ commonRoles: { items: [] } }] } }

  it('renders correctly', () => {
    const wrapper = shallow(
      <GroupSidebar
        group={{ ...group, memberCount }}
        currentUser={currentUser}
        members={members}
        leaders={leaders}
        responsibilities={responsibilities}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})

// describe('AboutSection', () => {
// TODO: Fix this test
//
//   it('renders correctly', () => {
//     const wrapper = shallow(
//       <AboutSection
//         name={group.name}
//         description={group.description} />)
//     expect(wrapper.find('div').at(1).text()).toEqual(`About ${group.name}`)
//     expect(wrapper.find('span').at(0).text()).toEqual('Read More')
//     expect(wrapper.find('span').at(0).text()).toEqual('Show Less')
//     wrapper.setState({ expanded: true })
//   })
// })

describe('MemberSection', () => {
  faker.seed(33)
  const n = 8
  const members = fakePerson(n)

  it("Doesn't show total if it's < 1", () => {
    const wrapper = shallow(<MemberSection
      slug='foo'
      members={members}
      memberCount={n}
      responsibilities={responsibilities}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it("Formats total correctly if it's > 999", () => {
    const wrapper = shallow(<MemberSection
      slug='foo'
      members={members}
      memberCount={5600} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Shows invite link if has responsibility ADD_MEMBERS is true', () => {
    const wrapper = shallow(<MemberSection
      slug='foo'
      members={members}
      memberCount={5600}
      responsibilities={responsibilities} />)
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
      avatarUrl: 'foo.png',
      commonRoles: { items: [] },
      groupRoles: { items: [] }
    }
    const wrapper = shallow(<GroupLeader leader={leader} />)
    expect(wrapper.find('Avatar').prop('avatarUrl')).toEqual(leader.avatarUrl)
    expect(wrapper.find('Link').get(0).props.children).toEqual(leader.name)
  })
})
