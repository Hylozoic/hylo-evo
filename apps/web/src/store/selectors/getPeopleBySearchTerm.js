import { includes, mapKeys } from 'lodash'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import filterDeletedUsers from 'util/filterDeletedUsers'

export const getPeopleBySearchTerm = ormCreateSelector(
  orm,
  (_, { searchTerm }) => searchTerm,
  (session, searchTerm) => {
    if (!searchTerm) return []
    return session.Person.all()
      .filter(filterDeletedUsers)
      .filter(person => {
        return includes(
          person.name && person.name.toLowerCase(),
          searchTerm.toLowerCase()
        )
      })
      .toRefArray()
      .map(person => {
        return mapKeys(person, (value, key) => {
          return {
            avatarUrl: 'avatar'
          }[key] || key
        })
      })
  }
)

export default getPeopleBySearchTerm
