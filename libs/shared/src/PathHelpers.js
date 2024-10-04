import { ALL_GROUPS_CONTEXT_SLUG, PUBLIC_CONTEXT_SLUG } from './constants'

export function topicPath (topicName, groupSlug) {
  if (groupSlug && ![ALL_GROUPS_CONTEXT_SLUG, PUBLIC_CONTEXT_SLUG].includes(groupSlug)) {
    return `/groups/${groupSlug}/topics/${topicName}`
  } else {
    return `/${ALL_GROUPS_CONTEXT_SLUG}/topics/${topicName}`
  }
}

export function mentionPath (memberId, groupSlug) {
  if (groupSlug && ![ALL_GROUPS_CONTEXT_SLUG, PUBLIC_CONTEXT_SLUG].includes(groupSlug)) {
    return `/groups/${groupSlug}/members/${memberId}`
  } else {
    return `/${ALL_GROUPS_CONTEXT_SLUG}/members/${memberId}`
  }
}
