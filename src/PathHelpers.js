export function topicPath (topicName, groupSlug) {
  if (groupSlug && !['all', 'public'].includes(groupSlug)) {
    return `/groups/${groupSlug}/topics/${topicName}`
  } else {
    return `/all/topics/${topicName}`
  }
}

export function mentionPath (memberId, groupSlug) {
  if (groupSlug) {
    return `/groups/${groupSlug}/members/${memberId}`
  } else {
    return `/members/${memberId}`
  }
}
