// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.
import { get, isNull, omitBy, pick, reduce, uniq, isEmpty, includes } from 'lodash/fp'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import {
  FETCH_POSTS,
  DROP_QUERY_RESULTS
} from 'store/constants'
import {
  CREATE_POST
} from 'components/PostEditor/PostEditor.store'
import {
  FETCH_NETWORK_SETTINGS,
  FETCH_MODERATORS,
  FETCH_COMMUNITIES
} from 'routes/NetworkSettings/NetworkSettings.store'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  const addNetworkModerators = state => {
    const params = {...meta.graphql.variables, page: meta.page}
    if (payload.data.network.moderators) {
      return appendIds(state, FETCH_MODERATORS, params, payload.data.network.moderators)
    } else {
      return state
    }
  }

  const addNetworkCommunities = state => {
    const params = {...meta.graphql.variables, page: meta.page}
    if (payload.data.network.communities) {
      return appendIds(state, FETCH_COMMUNITIES, params, payload.data.network.communities)
    } else {
      return state
    }
  }

  const { extractQueryResults } = meta || {}
  if (extractQueryResults && payload) {
    const { getItems, getParams, getType } = extractQueryResults
    return appendIds(state,
      getType ? getType(action) : action.type,
      getParams ? getParams(action) : meta.graphql.variables,
      getItems(action)
    )
  }

  // Purpose of this reducer:
  //   Ordering and subsets of ReduxORM data
  //

  switch (type) {
    case CREATE_POST:
      root = payload.data.createPost
      return matchNewPostIntoQueryResults(state, root)

    case FETCH_NETWORK_SETTINGS:
      return addNetworkCommunities(addNetworkModerators(state))

    case FETCH_MODERATORS:
      return addNetworkModerators(state)

    case FETCH_COMMUNITIES:
      return addNetworkCommunities(state)

    case DROP_QUERY_RESULTS:
      return {
        ...state,
        [payload]: null
      }
  }

  return state
}

export function matchNewPostIntoQueryResults (state, {id, type, communities}) {
  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  return reduce((memo, community) => {
    const queriesToMatch = [
      {slug: community.slug},
      {slug: community.slug, filter: type},
      {slug: community.slug, sortBy: 'updated'},
      {slug: community.slug, sortBy: 'updated', filter: type}
    ]
    return reduce((innerMemo, params) => {
      return prependIdForCreate(innerMemo, FETCH_POSTS, params, id)
    }, memo, queriesToMatch)
  }, state, communities)
}

function prependIdForCreate (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state
  return {
    ...state,
    [key]: {
      ids: [id].concat(state[key].ids),
      total: state[key].total && state[key].total + 1,
      hasMore: state[key].hasMore
    }
  }
}

function appendIds (state, type, params, data) {
  if (!data) return state
  const { items, total, hasMore } = data
  const key = buildKey(type, params)
  const existingIds = get('ids', state[key]) || []
  return {
    ...state,
    [key]: {
      ids: uniq(existingIds.concat(items.map(x => x.id))),
      total,
      hasMore
    }
  }
}

// selector factory

export function makeGetQueryResults (actionType) {
  return (state, props) => {
    // TBD: Sometimes parameters like "id" and "slug" are to be found in the
    // URL, in which case they are in e.g. props.match.params.id; and sometimes
    // they are passed directly to a component. Should buildKey handle both
    // cases?

    const key = buildKey(actionType, props)
    return state.queryResults[key]
  }
}

// action factory

export function makeDropQueryResults (actionType) {
  return props => {
    const key = buildKey(actionType, props)
    return {
      type: DROP_QUERY_RESULTS,
      payload: key
    }
  }
}

export function buildKey (type, params) {
  return JSON.stringify({
    type,
    params: omitBy(isNull, pick(queryParamWhitelist, params))
  })
}

export const queryParamWhitelist = [
  'id',
  'slug',
  'networkSlug',
  'sortBy',
  'search',
  'autocomplete',
  'filter',
  'topic',
  'type',
  'page'
]

export function makeQueryResultsModelSelector (resultsSelector, modelName, transform) {
  return ormCreateSelector(
    orm,
    state => state.orm,
    resultsSelector,
    (session, results) => {
      if (isEmpty(results) || isEmpty(results.ids)) return []
      return session[modelName].all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
      .map(transform)
    })
}
