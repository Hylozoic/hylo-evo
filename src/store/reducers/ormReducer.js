import orm from '../models'
import { FETCH_POST } from 'store/constants'

export default function ormReducer (dbState, action) {
  const sess = orm.session(dbState)

  const { type, payload } = action

  // Session-specific Models are available
  // as properties on the Session instance.
  const { Post } = sess

  switch (type) {
    case FETCH_POST:
      Post.parse(payload)
      break
  }

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return sess.state
}
