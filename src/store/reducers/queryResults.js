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
  FETCH_POST,
  FETCH_POSTS,
  FETCH_TOPICS,
  FETCH_DEFAULT_TOPICS,
  CREATE_POST,
  CREATE_PROJECT,
  DROP_QUERY_RESULTS,
  FIND_OR_CREATE_THREAD,
  FETCH_THREADS,
  FETCH_CHILD_COMMENTS,
  FETCH_COMMENTS,
  REMOVE_POST_PENDING
} from 'store/constants'
// import {
//   FETCH_NETWORK_SETTINGS,
//   FETCH_MODERATORS,
//   FETCH_GROUPS
// } from 'routes/NetworkSettings/NetworkSettings.store'
import {
  CREATE_TOPIC
} from 'components/CreateTopic/CreateTopic.store'
import {
  RECEIVE_POST,
  RECEIVE_THREAD
} from 'components/SocketListener/SocketListener.store'
import {
  FETCH_POSTS_MAP,
  FETCH_POSTS_MAP_DRAWER
} from 'routes/MapExplorer/MapExplorer.store'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  // Special case for post query- needs to extract subcomments as well.
  // Toplevel comments are handled by standard extractQueryResults (below).
  if (type === FETCH_POST || type === FETCH_COMMENTS) {
    state = matchSubCommentsIntoQueryResults(state, payload)
  }

  const { extractQueryResults } = meta || {}
  if (extractQueryResults && payload) {
    const { getItems, getRouteParams, getType, replace } = extractQueryResults
    return updateIds(state,
      getType ? getType(action) : action.type,
      getRouteParams ? getRouteParams(action) : meta.graphql.variables,
      getItems(action),
      replace
    )
  }

  // Purpose of this reducer:
  //   Ordering and subsets of ReduxORM data
  //

  switch (type) {
    case CREATE_PROJECT:
    case CREATE_POST:
    case RECEIVE_POST:
      root = {
        ...(payload.data[camelCase(type)] || payload.data.post)
      }
      return matchNewPostIntoQueryResults(state, root)

    case FIND_OR_CREATE_THREAD:
      root = payload.data.findOrCreateThread
      return matchNewThreadIntoQueryResults(state, root)

    case RECEIVE_THREAD:
      return matchNewThreadIntoQueryResults(state, payload.data.thread)

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

export function matchNewPostIntoQueryResults (state, { id, isPublic, type, groups, topics = [] }) {
  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  const queriesToMatch = []

  // All Groups stream w/ topics
  queriesToMatch.push({ context: 'all' })
  for (let topic of topics) {
    queriesToMatch.push(
      { context: 'all', topic: topic.id }
    )
  }

  // Public posts stream
  if (isPublic) {
    queriesToMatch.push({ context: 'public' })
  }

  // Group streams
  return reduce((memo, group) => {
    // Chat posts only appear in the chat rooms, nowhere else
    if (type !== 'chat') {
      queriesToMatch.push(
        { context: 'groups', slug: group.slug },
        { context: 'groups', slug: group.slug, activePostsOnly: false, childPostInclusion: 'no' },
        { context: 'groups', slug: group.slug, activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, activePostsOnly: true, childPostInclusion: 'no' }, // For custom views
        { context: 'groups', slug: group.slug, activePostsOnly: true, childPostInclusion: 'yes' }, // For custom views
        { context: 'groups', slug: group.slug, groupSlugs: [group.slug], childPostInclusion: 'yes' }, // For FETCH_POSTS_MAP
        { context: 'groups', slug: group.slug, groupSlugs: [group.slug], childPostInclusion: 'no' }, // For FETCH_POSTS_MAP
        { context: 'groups', slug: group.slug, filter: type },
        { context: 'groups', slug: group.slug, filter: type, activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, filter: type, activePostsOnly: false, childPostInclusion: 'no' },
        { context: 'groups', slug: group.slug, sortBy: 'updated', activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, sortBy: 'updated', activePostsOnly: false, childPostInclusion: 'no' },
        { context: 'groups', slug: group.slug, sortBy: 'updated', activePostsOnly: true }, // For custom views
        { context: 'groups', slug: group.slug, sortBy: 'updated', search: '', groupSlugs: [group.slug], childPostInclusion: 'yes' }, // For FETCH_POSTS_MAP_DRAWER
        { context: 'groups', slug: group.slug, sortBy: 'updated', search: '', groupSlugs: [group.slug], childPostInclusion: 'no' }, // For FETCH_POSTS_MAP_DRAWER
        { context: 'groups', slug: group.slug, sortBy: 'updated', filter: type, activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, sortBy: 'updated', filter: type, activePostsOnly: false, childPostInclusion: 'no' },
        { context: 'groups', slug: group.slug, sortBy: 'created', activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, sortBy: 'created', activePostsOnly: false, childPostInclusion: 'no' },
        { context: 'groups', slug: group.slug, sortBy: 'created', activePostsOnly: true }, // For custom views
        { context: 'groups', slug: group.slug, sortBy: 'created', search: '', groupSlugs: [group.slug], childPostInclusion: 'yes' }, // For FETCH_POSTS_MAP_DRAWER
        { context: 'groups', slug: group.slug, sortBy: 'created', search: '', groupSlugs: [group.slug], childPostInclusion: 'no' }, // For FETCH_POSTS_MAP_DRAWER
        { context: 'groups', slug: group.slug, sortBy: 'created', filter: type, activePostsOnly: false, childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, sortBy: 'created', filter: type, activePostsOnly: false, childPostInclusion: 'no' },
        // For events stream upcoming events
        { context: 'groups', slug: group.slug, sortBy: 'start_time', filter: type, order: 'asc', childPostInclusion: 'yes' },
        { context: 'groups', slug: group.slug, sortBy: 'start_time', filter: type, order: 'asc', childPostInclusion: 'no' }
      )
    }

    for (let topic of topics) {
      queriesToMatch.push(
        // Add to the future posts in a topic (future because of order: 'asc')
        { context: 'groups', slug: group.slug, sortBy: 'id', order: 'asc', topic: topic.id, filter: 'chat', childPostInclusion: 'no' }
      )
    }

    return reduce((innerMemo, params) => {
      innerMemo = prependIdForCreate(innerMemo, FETCH_POSTS_MAP, params, id)
      innerMemo = prependIdForCreate(innerMemo, FETCH_POSTS_MAP_DRAWER, params, id)
      return prependIdForCreate(innerMemo, FETCH_POSTS, params, id)
    }, memo, queriesToMatch)
  }, state, groups)
}

export function matchNewTopicIntoQueryResults (state, { id, isDefault, groupTopics }) {
  const queriesToMatch = []

  // All Groups topics
  queriesToMatch.push({ sortBy: 'name' })

  // Group topics
  return reduce((memo, groupTopic) => {
    queriesToMatch.push(
      { groupSlug: groupTopic.group.slug, autocomplete: '' },
      { groupSlug: groupTopic.group.slug, sortBy: 'name', autocomplete: '' },
      { groupSlug: groupTopic.group.slug, sortBy: 'updated_at', autocomplete: '' },
      { groupSlug: groupTopic.group.slug, sortBy: 'num_followers', autocomplete: '' }
    )

    return reduce((innerMemo, params) => {
      if (isDefault) {
        innerMemo = appendId(innerMemo, FETCH_DEFAULT_TOPICS, params, id)
      }
      return prependIdForCreate(innerMemo, FETCH_TOPICS, params, id)
    }, memo, queriesToMatch)
  }, state, groupTopics.items)
}

export function matchNewThreadIntoQueryResults (state, { id, type }) {
  return prependIdForCreate(state, FETCH_THREADS, null, id)
}

export function matchSubCommentsIntoQueryResults (state, { data }) {
  const toplevelComments = get(`post.comments.items`, data)

  if (toplevelComments) {
    toplevelComments.forEach(comment => {
      state = updateIds(state,
        FETCH_CHILD_COMMENTS,
        { id: comment.id },
        get(`childComments`, comment) || {}
      )
    })
  }

  return state
}

function prependIdForCreate (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state
  return !state[key].ids.includes(id) ? {
    ...state,
    [key]: {
      ids: [id].concat(state[key].ids),
      total: (state[key].total || state[key].total === 0) && state[key].total + 1,
      hasMore: state[key].hasMore
    }
  } : state
}

function appendId (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state
  return !state[key].ids.includes(id) ? {
    ...state,
    [key]: {
      ids: state[key].ids.concat(id),
      total: (state[key].total || state[key].total === 0) && state[key].total + 1,
      hasMore: state[key].hasMore
    }
  } : state
}

// If replace is false add new ids to the existing list, if true then replace list
function updateIds (state, type, params, data, replace = false) {
  if (!data) return state
  const { items = [], total, hasMore } = data
  const key = buildKey(type, params)
  const existingIds = get('ids', state[key]) || []
  const newIds = items.map(x => x.id)
  return {
    ...state,
    [key]: {
      ids: replace ? newIds : uniq(existingIds.concat(newIds)),
      total,
      hasMore
    }
  }
}

// selector factory

export function makeGetQueryResults (actionType) {
  return (state, props) => {
    // TBD: Sometimes parameters like 'id' and 'groupSlug' are to be found in the
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
  'autocomplete',
  'activePostsOnly',
  'announcementsOnly',
  'childPostInclusion',
  'context',
  'collectionToFilterOut',
  'createdBy',
  'farmQuery',
  'filter',
  'forCollection',
  'groupSlug',
  'groupSlugs',
  'groupType',
  'id',
  'interactedWithBy',
  'mentionsOf',
  'order',
  'page',
  'parentSlugs',
  'search',
  'slug',
  'sortBy',
  'topic',
  'type', // TODO: why do we have type & filter? should only need one
  'types',
  'page',
  'nearCoord'
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
