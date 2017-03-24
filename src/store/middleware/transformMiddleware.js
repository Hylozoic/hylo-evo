import { FETCH_POSTS, ADD_POST } from '../constants'
import transform from '../transformers/postTransformer'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          if (payload.length === 0) break
          addCommunities(dispatch, payload)
          //addComments(dispatch, payload)
          //addPersons(dispatch, payload)
          addPosts(dispatch, payload)
          break
      }
    }
    return next(action)
  }
}

function addCommunities (dispatch, { communities }) {
  if (communities) {
    communities.forEach(community => {
      dispatch({
        type: ADD_COMMUNITY,
        payload: transform(community)
      })
    })
  }
}

function addPosts (dispatch, posts) {
  posts.forEach(post => {
    dispatch({
      type: ADD_POST,
      payload: transform(post)
    })
  })
}

