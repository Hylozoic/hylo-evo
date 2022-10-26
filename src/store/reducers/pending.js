export const initialState = {}

export default function pending (state = initialState, action) {
  const { type, meta, error } = action

  if (error) return state

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
