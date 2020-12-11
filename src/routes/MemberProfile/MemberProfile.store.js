import { createSelector } from 'reselect'
import getPerson from 'store/selectors/getPerson'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'
export const FETCH_MEMBER_POSTS = 'FETCH_MEMBER_POSTS'
export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'
export const FETCH_MEMBER_VOTES = 'FETCH_MEMBER_VOTES'

export function getMemberships (person) {
  return person.memberships.toModelArray().map(membership => ({
    ...membership.ref,
    community: membership.community.ref
  }))
}

export function getRoleForCommunity (person, communitySlug) {
  const memberships = getMemberships(person)

  return memberships.find(m => m.community.slug === communitySlug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

export function presentPerson (person, selectedCommunitySlug) {
  return {
    ...person.ref,
    role: getRoleForCommunity(person, selectedCommunitySlug),
    skills: person.skills && person.skills.toRefArray(),
    memberships: getMemberships(person)
  }
}

export const getPresentedPerson = createSelector(
  getPerson,
  (state, { slug }) => slug,
  (person, slug) => person && presentPerson(person, slug)
)
