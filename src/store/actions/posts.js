import { omitBy, includes } from 'lodash'
import qs from 'querystring'
import {
  FETCH_POSTS,
  CREATE_POST
} from '../constants'
// import samplePostApi from 'components/PostCard/samplePostApi.json'

export function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POSTS,
    // Optionally bypass middleware and load response directly
    // payload: samplePostApi
    payload: {api: true, path: `/noo/post/${id}`}
  }
}

// title,
// details,
// communityIds,
// startsAt,
// endsAt,
// parentPostId
export function createPost (title, details, communityIds, postType) {
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($title: String, $details: String, $communityIds: [String]) {
        createPost(data: {title: $title, details: $details, communityIds: $communityIds}) {
          id
          title
          details
        }
      }`,
      variables: {
        title,
        details,
        communityIds
      }
    }
  }
}

export function cleanAndStringify (opts, defaults) {
  return qs.stringify(omitBy(opts, blankOrDefault(defaults)))
}

const commonDefaults = {
  type: ['all+welcome', 'all'],
  sort: 'recent'
}

const blankOrDefault = (defaults = commonDefaults) => (value, key) => {
  let defaultValue = defaults[key]
  return defaultValue === value ||
    (!value && value !== 0) ||
    (Array.isArray(defaultValue) && includes(defaultValue, value))
}
