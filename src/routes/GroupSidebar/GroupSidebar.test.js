import
GroupSidebar,
{
  MemberSection,
  GroupStewardsSection,
  GroupSteward
} from './GroupSidebar'
// import AboutSection from './AboutSection'
import { shallow } from 'enzyme'
import React from 'react'
import faker from '@faker-js/faker'
import { fakePerson } from 'util/testing/testData'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'

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
  const stewards = [{ id: 4 }, { id: 5 }, { id: 6 }]
  const memberCount = 56
  const currentUser = { memberships: { toRefArray: () => [{ commonRoles: { items: [] } }] } }

  it('renders correctly', () => {
    const { asFragment } = render(
      <GroupSidebar
        group={{ ...group, memberCount }}
        currentUser={currentUser}
        members={members}
        stewards={stewards}
        myResponsibilities={responsibilities}
      />,
      { wrapper: AllTheProviders() }
    )
    expect(asFragment()).toMatchSnapshot()
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

describe('GroupStewardsSection', () => {
  it('renders correctly', async () => {
    const n = 5
    const stewards = fakePerson(n)
    render(<GroupStewardsSection stewards={stewards} descriptor='Wizard' />, { wrapper: AllTheProviders() })

    expect(await screen.findByText('Group {{locationDescriptor}}')).toBeInTheDocument()
  })
})

describe('GroupSteward', () => {
  it('renders correctly', async () => {
    const steward = {
      id: 1,
      name: 'Jon Smith',
      avatarUrl: 'foo.png',
      commonRoles: { items: [] },
      groupRoles: { items: [] }
    }
    render(<GroupSteward steward={steward} />, { wrapper: AllTheProviders() })
    expect(await screen.findByText(steward.name)).toBeInTheDocument()
  })
})
