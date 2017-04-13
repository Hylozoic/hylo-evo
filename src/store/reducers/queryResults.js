// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.

import { FETCH_MEMBERS } from 'routes/Members/Members.store'
import { get, pick, uniq } from 'lodash/fp'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return

  // If this starts to feel too coupled to specific actions, we could move the
  // parameters below into the action's metadata, write a piece of middleware to
  // detect the metadata and produce a generic action, and have this reducer
  // handle only that action.
  switch (type) {
    case FETCH_MEMBERS:
      return appendIds(state, type, meta.graphql.variables, payload.data.community, 'members')
  }

  return state
}

function appendIds (state, type, params, data, itemsKey) {
  const key = buildKey(type, params)
  const existingIds = get('ids', state[key]) || []
  return {
    ...state,
    [key]: {
      ids: uniq(existingIds.concat(data[itemsKey].map(x => x.id))),
      total: data[itemsKey + 'Total']
    }
  }
}

// selector factory

export function makeGetQueryResults (actionType) {
  return (state, props) => {
    const key = buildKey(actionType, props)
    return state.queryResults[key]
  }
}

function buildKey (type, params) {
  return JSON.stringify({type, params: pick(whitelist, params)})
}

const whitelist = ['slug', 'sortBy']
