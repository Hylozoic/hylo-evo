import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getPublicGroups = ormCreateSelector(
  orm,
  (session) => session.Group.filter(g => {
    console.log(g.id, 'vis')
    // return g.visibility === '1'
    return true
  }).toModelArray()
)

export default getPublicGroups
