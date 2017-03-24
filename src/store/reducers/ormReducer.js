import { orm } from '../models'
import { FETCH_POSTS } from 'store/constants'

export default function ormReducer (state, action) {
  const session = orm.session(state)

  const { type, payload } = action

  // Session-specific Models are available
  // as properties on the Session instance.
  const { Post } = session

  switch (type) {
    case FETCH_POSTS:
      Post.parse(payload)
      break
  }

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return session.state
}
