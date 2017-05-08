// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.

import { FETCH_MEMBERS } from 'routes/Members/Members.store'
import {
  FETCH_POST,
  FETCH_POSTS,
  FETCH_COMMENTS,
  FETCH_THREAD,
  FETCH_MESSAGES,
  FETCH_COMMUNITY_TOPICS,
  FETCH_TOPICS
} from 'store/constants'
import { get, isNull, omitBy, pick, uniq } from 'lodash/fp'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  // If this starts to feel too coupled to specific actions, we could move the
  // parameters below into the action's metadata, write a piece of middleware to
  // detect the metadata and produce a generic action, and have this reducer
  // handle only that action.
  switch (type) {
    case FETCH_TOPICS:
      return appendIds(state, type, meta.graphql.variables, payload.data.topics)

    case FETCH_COMMUNITY_TOPICS:
      return appendIds(state, type, meta.graphql.variables, payload.data.communityTopics)

    case FETCH_MEMBERS:
      return appendIds(state, type, meta.graphql.variables, payload.data.community.members)

    case FETCH_POSTS:
      root = payload.data.posts || payload.data.community.posts
      return appendIds(state, type, meta.graphql.variables, root)

    case FETCH_THREAD:
    case FETCH_MESSAGES:
      return appendIds(state, FETCH_MESSAGES, meta.graphql.variables, payload.data.messageThread.messages)

    case FETCH_POST:
    case FETCH_COMMENTS:
      return appendIds(state, FETCH_COMMENTS, meta.graphql.variables, payload.data.post.comments)
  }

  return state
}

function appendIds (state, type, params, { items, total, hasMore }) {
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

export function buildKey (type, params) {
  return JSON.stringify({
    type,
    params: omitBy(isNull, pick(queryParamWhitelist, params))
  })
}

export const queryParamWhitelist = ['id', 'slug', 'sortBy', 'search', 'filter', 'topic', 'name', 'topicName', 'communitySlug', 'autocomplete']
