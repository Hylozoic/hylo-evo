import { ORM } from 'redux-orm'
import Post, { PostFollower } from './Post'
import Person from './Person'
import Community from './Community'
import Comment from './Comment'
import FeedItem from './FeedItem'

export const orm = new ORM()
orm.register(Post, PostFollower, Person, Community, Comment, FeedItem)

export default orm
