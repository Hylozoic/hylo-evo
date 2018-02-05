import { filter, get, map } from 'lodash/fp'

export function getOthers ({currentUser, thread}) {
  const participants = get('participants', thread) || []
  if (!currentUser) return participants
  const id = get('id', currentUser)
  return currentUser && map('name', filter(f => f.id !== id, participants))
}

export function getThreadId ({thread}) {
  return get('id', thread)
}
