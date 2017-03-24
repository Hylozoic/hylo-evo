import { FETCH_POSTS, ADD_COMMUNITY, ADD_POST } from '../constants'
import transformCommunity from '../transformers/communityTransformer'
import transformPost from '../transformers/postTransformer'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          if (payload.length === 0) break
          addCommunities(dispatch, payload)
          addComments(dispatch, payload)
          //addPersons(dispatch, payload)
          addPosts(dispatch, payload)
          break
      }
    }
    return next(action)
  }
}

function addComments (dispatch, { comments }) {
  if (comments) {
    comments.forEach(comment => 
      dispatch({
        type: ADD_COMMENT,
        payload: transformComment(comment)
      })
    )
  }
}

function addCommunities (dispatch, { communities }) {
  if (communities) {
    communities.forEach(community =>
      dispatch({
        type: ADD_COMMUNITY,
        payload: transformCommunity(community)
      })
    )
  }
}

function addPosts (dispatch, posts) {
  posts.forEach(post => 
    dispatch({
      type: ADD_POST,
      payload: transformPost(post)
    })
  )
}

