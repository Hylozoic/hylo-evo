import { createSelector } from 'redux-orm'
import orm from 'store/models'

const getMySkills = createSelector(
  orm,
  state => state.orm,
  (session) => {
    const me = session.Me.first()
    if (!me) return []
    return me.skills.toRefArray()
  }
)

export default getMySkills
