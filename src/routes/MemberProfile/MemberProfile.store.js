import { createSelector } from 'reselect'
import getPerson from 'store/selectors/getPerson'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'
export const FETCH_MEMBER_POSTS = 'FETCH_MEMBER_POSTS'
export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'
export const FETCH_MEMBER_VOTES = 'FETCH_MEMBER_VOTES'
export const FETCH_PROJECTS = 'FETCH_PROJECTS'

const defaultState = {
  projects: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_PROJECTS:
      return {
        ...state,
        projects: payload.data.projects.items
      }
    default:
      return state
  }
}

export function fetchProjects (context, contextId, viewerId) {
  return {
    type: FETCH_PROJECTS,
    graphql: {
      query: `query ($context: String, $contextId: ID, $viewerId: ID) {
        projects(context: $context, contextId: $contextId, viewerId: $viewerId) {
          items {
            id
            title
            createdAt
            creator {
              name
            }
            members {
              items {
                avatarUrl
              }
            }
          }
        }
      }`,
      variables: { context, contextId, viewerId }
    }
  }
}

export function getRoleForCommunity (person, communitySlug) {
  const memberships = person.memberships.toModelArray().map(membership => ({
    ...membership.ref,
    community: membership.community.ref
  }))

  return memberships.find(m => m.community.slug === communitySlug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

export function presentPerson (person, selectedCommunitySlug) {
  return {
    ...person.ref,
    role: getRoleForCommunity(person, selectedCommunitySlug),
    skills: person.skills && person.skills.toRefArray()
  }
}

export const getPresentedPerson = createSelector(
  getPerson,
  (state, { slug }) => slug,
  (person, slug) => person && presentPerson(person, slug)
)
