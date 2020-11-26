import { createSelector } from 'reselect'
import getPerson from 'store/selectors/getPerson'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'
export const FETCH_MEMBER_POSTS = 'FETCH_MEMBER_POSTS'
export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'
export const FETCH_MEMBER_VOTES = 'FETCH_MEMBER_VOTES'

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
    projects: person.projects && person.projects.items,
    role: getRoleForCommunity(person, selectedCommunitySlug),
    skills: person.skills && person.skills.toRefArray()
  }
}

export const getPresentedPerson = createSelector(
  getPerson,
  (state, { slug }) => slug,
  (person, slug) => person && presentPerson(person, slug)
)
