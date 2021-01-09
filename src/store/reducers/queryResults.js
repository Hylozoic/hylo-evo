// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to 'Name' separately from when it is set
// to 'Location'. And both of these lists are different from what should be
// shown when something has been typed into the search field.
import { get, isNull, omitBy, pick, reduce, uniq, isEmpty, includes } from 'lodash/fp'
import { mapValues, camelCase } from 'lodash'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import {
  FETCH_POSTS,
  FETCH_TOPICS,
  FETCH_DEFAULT_TOPICS,
  CREATE_POST,
  CREATE_PROJECT,
  DROP_QUERY_RESULTS,
  FIND_OR_CREATE_THREAD,
  FETCH_THREADS
} from 'store/constants'
import {
  FETCH_NETWORK_SETTINGS,
  FETCH_MODERATORS,
  FETCH_COMMUNITIES
} from 'routes/NetworkSettings/NetworkSettings.store'
import {
  CREATE_TOPIC
} from 'components/CreateTopic/CreateTopic.store'
import {
  REMOVE_POST_PENDING
} from 'components/PostCard/PostHeader/PostHeader.store'
import {
  RECEIVE_THREAD
} from 'components/SocketListener/SocketListener.store'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  const addNetworkModerators = state => {
    const params = { ...meta.graphql.variables, page: meta.page }
    if (payload.data.network.moderators) {
      return appendIds(state, FETCH_MODERATORS, params, payload.data.network.moderators)
    } else {
      return state
    }
  }

  const addNetworkCommunities = state => {
    const params = { ...meta.graphql.variables, page: meta.page }
    if (payload.data.network.communities) {
      return appendIds(state, FETCH_COMMUNITIES, params, payload.data.network.communities)
    } else {
      return state
    }
  }

  const { extractQueryResults } = meta || {}
  if (extractQueryResults && payload) {
    const { getItems, getRouteParams, getType } = extractQueryResults
    return appendIds(state,
      getType ? getType(action) : action.type,
      getRouteParams ? getRouteParams(action) : meta.graphql.variables,
      getItems(action)
    )
  }

  // Purpose of this reducer:
  //   Ordering and subsets of ReduxORM data
  //

  switch (type) {
    case CREATE_PROJECT:
    case CREATE_POST:
      root = {
        networkSlug: meta.networkSlug,
        ...payload.data[camelCase(type)]
      }
      return matchNewPostIntoQueryResults(state, root)

    case FIND_OR_CREATE_THREAD:
      root = payload.data.findOrCreateThread
      return matchNewThreadIntoQueryResults(state, root)

    case RECEIVE_THREAD:
      return matchNewThreadIntoQueryResults(state, payload.data.thread)

    case FETCH_NETWORK_SETTINGS:
      return addNetworkCommunities(addNetworkModerators(state))

    case FETCH_MODERATORS:
      return addNetworkModerators(state)

    case FETCH_COMMUNITIES:
      return addNetworkCommunities(state)

    case REMOVE_POST_PENDING:
      return mapValues(state, (results, key) => {
        if (get('params.slug', JSON.parse(key)) !== meta.slug) return results
        return {
          ...results,
          ids: results.ids.filter(id => id !== meta.postId)
        }
      })

    case CREATE_TOPIC:
      root = {
        isDefault: meta.data.isDefault,
        ...payload.data.createTopic
      }
      return matchNewTopicIntoQueryResults(state, root)

    case DROP_QUERY_RESULTS:
      return {
        ...state,
        [payload]: null
      }
  }

  return state
}

export function matchNewPostIntoQueryResults (state, { id, type, networkSlug, communities, topics = [] }) {
  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  const queriesToMatch = []

  // All Communities feed w/ topics
  queriesToMatch.push({})
  for (let topic of topics) {
    queriesToMatch.push(
      { topic: topic.id }
    )
  }
  // Network feeds w/ topics
  if (networkSlug) {
    queriesToMatch.push(
      { networkSlug },
      { networkSlug, filter: type },
      { networkSlug, sortBy: 'updated' },
      { networkSlug, sortBy: 'updated', filter: type }
    )
    for (let topic of topics) {
      queriesToMatch.push(
        { networkSlug: networkSlug, topic: topic.id }
      )
    }
  }

  // Community feeds w/ topics
  return reduce((memo, community) => {
    queriesToMatch.push(
      { slug: community.slug },
      { slug: community.slug, filter: type },
      { slug: community.slug, sortBy: 'updated' },
      { slug: community.slug, sortBy: 'updated', filter: type }
    )
    for (let topic of topics) {
      queriesToMatch.push(
        { slug: community.slug, topic: topic.id }
      )
    }
    return reduce((innerMemo, params) => {
      return prependIdForCreate(innerMemo, FETCH_POSTS, params, id)
    }, memo, queriesToMatch)
  }, state, communities)
}

export function matchNewTopicIntoQueryResults (state, { id, isDefault, networkSlug, communityTopics }) {
  const queriesToMatch = []

  // All Communities topics
  queriesToMatch.push({ sortBy: 'name' })

  // Network topics
  if (networkSlug) {
    queriesToMatch.push(
      { networkSlug, autocomplete: '' },
      { networkSlug, sortBy: 'name', autocomplete: '' },
      { networkSlug, sortBy: 'updated_at', autocomplete: '' },
      { networkSlug, sortBy: 'num_followers', autocomplete: '' }
    )
  }

  // Community topics
  return reduce((memo, communityTopic) => {
    queriesToMatch.push(
      { communitySlug: communityTopic.community.slug, autocomplete: '' },
      { communitySlug: communityTopic.community.slug, sortBy: 'name', autocomplete: '' },
      { communitySlug: communityTopic.community.slug, sortBy: 'updated_at', autocomplete: '' },
      { communitySlug: communityTopic.community.slug, sortBy: 'num_followers', autocomplete: '' }
    )

    return reduce((innerMemo, params) => {
      if (isDefault) {
        innerMemo = appendId(innerMemo, FETCH_DEFAULT_TOPICS, params, id)
      }
      return prependIdForCreate(innerMemo, FETCH_TOPICS, params, id)
    }, memo, queriesToMatch)
  }, state, communityTopics.items)
}

export function matchNewThreadIntoQueryResults (state, { id, type }) {
  return prependIdForCreate(state, FETCH_THREADS, null, id)
}

function prependIdForCreate (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state
  return {
    ...state,
    [key]: {
      ids: !state[key].ids.includes(id) ? [id].concat(state[key].ids) : state[key].ids,
      total: state[key].total && state[key].total + 1,
      hasMore: state[key].hasMore
    }
  }
}

function appendId (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state
  return {
    ...state,
    [key]: {
      ids: !state[key].ids.includes(id) ? state[key].ids.concat(id) : state[key].ids,
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
    // TBD: Sometimes parameters like 'id' and 'slug' are to be found in the
    // URL, in which case they are in e.g. props.match.params.id; and sometimes
    // they are passed directly to a component. Should buildKey handle both
    // cases?
    const key = buildKey(actionType, props)

    // NOTE: cannot use lodash.get here because boundingBox string includes [, ] and . characters which are special in get
    return state.queryResults ? state.queryResults[key] : null
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
  'communitySlug',
  'networkSlug',
  'networkSlugs',
  'sortBy',
  'search',
  'autocomplete',
  'filter',
  'topic',
  'type',
  'page',
  'isPublic'
]

export function makeQueryResultsModelSelector (resultsSelector, modelName, transform = i => i) {
  return ormCreateSelector(
    orm,
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
