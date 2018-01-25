import { filter, get, map } from 'lodash/fp'

export function getOthers ({currentUser, thread}) {
  const participants = get('participants', thread) || []
  const id = get('id', currentUser)
  return currentUser && map('name', filter(f => f.id !== id, participants))
}
