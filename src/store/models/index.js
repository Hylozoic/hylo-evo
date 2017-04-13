import { ORM } from 'redux-orm'
import './Model.extension'
import Comment from './Comment'
import Community from './Community'
import FeedItem from './FeedItem'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import Post, { PostFollower, PostCommenter } from './Post'

export const orm = new ORM()
orm.register(
  Comment,
  Community,
  FeedItem,
  Me,
  Membership,
  Person,
  Post,
  PostFollower,
  PostCommenter
)

export default orm
