import orm from '../models'
import { FETCH_POST } from 'store/constants'

export default function ormReducer (dbState, action) {
  const sess = orm.session(dbState)

  const { type, payload } = action

  // Session-specific Models are available
  // as properties on the Session instance.
  const { Post, Person } = sess

  switch (type) {
    case FETCH_POST:
      const { people } = payload
      Post.create(payload)
      console.log(people)
      if (people.length > 0) {
        people.forEach(person => Person.create(person))
      }
      break
  }

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return sess.state
}
