import transformComment from '../transformers/commentTransformer'
import transformCommunity from '../transformers/communityTransformer'
import transformPost from '../transformers/postTransformer'
import {
  ADD_OR_UPDATE_COMMENT,
  ADD_OR_UPDATE_COMMUNITY,
  ADD_OR_UPDATE_PERSON,
  ADD_OR_UPDATE_POST,
  FETCH_POSTS
} from '../constants'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          if (payload.length === 0) break
          addRelations(dispatch, payload)
          break
      }
    }
    return next(action)
  }
}

function pushIfUnique (arr, entity) {
  if (!arr.find(e => e.id === entity.id)) arr.push(entity)
}

function addRelations (dispatch, posts) {
  let people = []

  posts.forEach(post => {
    const { comments, communities, followers } = post
    if (comments) {
      comments.forEach(c => {
        pushIfUnique(people, c.creator)
        dispatch({ type: ADD_OR_UPDATE_COMMENT, payload: transformComment(c) })
      })
    }
    if (communities) {
      communities.forEach(c => {
        if (c.members) {
          c.members.forEach(m => pushIfUnique(people, m))
        }
        dispatch({ type: ADD_OR_UPDATE_COMMUNITY, payload: transformCommunity(c) })
      })
    }
    if (followers) {
      followers.forEach(f => pushIfUnique(people, post.creator))
    }
    
    pushIfUnique(people, post.creator)
    dispatch({ type: ADD_OR_UPDATE_POST, payload: transformPost(post) })
  })
  people.forEach(p => dispatch({ type: ADD_OR_UPDATE_PERSON, payload: p }))
}

