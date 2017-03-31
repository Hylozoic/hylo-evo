import { ORM } from 'redux-orm'
import Post, { PostFollower } from './Post'
import Person from './Person'
import Community from './Community'
import Comment from './Comment'
import FeedItem from './FeedItem'

export const orm = new ORM()
orm.register(
  Comment,
  Community,
  FeedItem,
  Person,
  Post,
  PostFollower
)

// get Model.fields for each model
export function allFields () {
  return [
    Comment,
    Community,
    FeedItem,
    Person,
    Post
  ].reduce(
    (fields, entityClass) => ({
      ...fields,
      [entityClass.modelName]: entityClass.fields
    }), {}
  )
}

export default orm
