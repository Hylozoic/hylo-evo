import { shallow } from 'enzyme'
import React from 'react'
import orm from 'store/models'
import { graphql } from 'msw'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import denormalized from './MemberProfile.test.json'
import MemberProfile from './MemberProfile.js'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  },
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

function testWrapper (providedState) {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create(denormalized.data.person)
  const reduxState = { orm: ormSession.state, ...providedState }
  return AllTheProviders(reduxState)
}

describe('MemberProfile', () => {
  const defaultTestProps = {
    routeParams: { personId: '1' },
    person: denormalized.data.person,
    fetchPerson: jest.fn(),
    roles: []
  }

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(<MemberProfile {...defaultTestProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an error if one is present', () => {
    const props = {
      ...defaultTestProps,
      error: 'WOMBAT-TYPE INVALID'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('Error')).toBe(true)
  })

  it('displays bio on the Overview tab', async () => {
    mockGraphqlServer.resetHandlers(
      graphql.query('MemberSkills', (req, res, ctx) => {
        return res(
          ctx.data({
            person: {
              id: '1',
              skills: {
                items: []
              }
            }
          })
        )
      }),
      graphql.query('MemberSkillsToLearn', (req, res, ctx) => {
        return res(
          ctx.data({
            person: {
              id: '1',
              skills: {
                items: [{ id: 1, name: 'skill' }]
              }
            }
          })
        )
      }),
      graphql.query('RecentActivity', (req, res, ctx) => {
        return res(
          ctx.data({
            person: {
              id: '1',
              comments: {
                items: [{
                  id: 1,
                  text: 'hello',
                  creator: { id: 1 },
                  post: { id: 1, title: 'title', createdAt: '2021-04-12T15:00:00.000Z' },
                  attachments: [],
                  createdAt: '2021-04-12T15:00:00.000Z'
                }],
                posts: []
              }
            }
          })
        )
      })
    )

    const props = {
      ...defaultTestProps,
      currentTab: 'Overview',
      person: {
        ...defaultTestProps.person,
        bio: 'WOMBATS'
      }
    }

    render(
      <MemberProfile {...props} />,
      { wrapper: testWrapper() }
    )

    expect(screen.getByText('WOMBATS')).toBeInTheDocument()
  })

  it('does not display bio on other tabs', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Reactions',
      bio: 'WOMBATS',
      votes: []
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.contains('WOMBATS')).toBe(false)
  })

  it('renders RecentActivity on Overview', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Overview'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('recent activity')).toBe(true)
  })

  it('renders MemberPosts on Posts', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Posts'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s posts')).toBe(true)
  })

  it('renders MemberComments on Comments', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Comments'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s comments')).toBe(true)
  })

  it('renders MemberVotes on reactions', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Reactions',
      roles: [{ id: 1, common: true, responsibilities: { items: [{ id: 1, title: 'Manage Content' }] } }]
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s reactions')).toBe(true)
  })
})
