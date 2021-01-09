import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = `Review`
export const CREATE_GROUP = `${MODULE_NAME}/CREATE_GROUP`

export function createGroup (name, slug, parentIds) {
  const data = {
    name,
    slug
  }

  if (parentIds) {
    data.parentIds = parentIds
  }

  return {
    type: CREATE_GROUP,
    graphql: {
      query: `mutation ($data: GroupInput) {
        createGroup(data: $data) {
          id
          hasModeratorRole
          group {
            id
            name
            slug
            parentGroups {
              items {
                id
              }
            }
          }
        }
      }
      `,
      variables: {
        data
      }
    },
    meta: {
      extractModel: 'Membership',
      ...data,
      analytics: AnalyticsEvents.GROUP_CREATED
    }
  }
}

export const getParents = ormCreateSelector(
  orm,
  (state, { parentIds }) => parentIds,
  (session, parentIds) => {
    return parentIds && parentIds.length > 0 ? session.Group.filter(g => parentIds.includes(g.id)).toModelArray() : []
  }
)
