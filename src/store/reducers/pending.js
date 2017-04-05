export default function pending (state = {}, action) {
  const { type, meta } = action

  const originalType = type.replace(/_PENDING/, '')

  if (type.endsWith('_PENDING')) {
    return {
      ...state,
      [originalType]: meta || true
    }
  } else if (state[originalType]) {
    return {
      ...state,
      [originalType]: null
    }
  }

  return state
}
