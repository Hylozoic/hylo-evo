import { filter, get, map } from 'lodash/fp'

export function getParticipants ({thread}) {
  return get('participants', thread) || []
}

export function getOthers ({currentUser}, participants) {
  const id = get('id', currentUser)
  return currentUser && map('name', filter(f => f.id !== id, participants))
}
