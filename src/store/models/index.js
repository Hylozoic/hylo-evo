import { ORM } from 'redux-orm'

import Comment from './Comment'
import Community from './Community'
import FeedItem from './FeedItem'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import Message from './Message'
import MessageThread from './MessageThread'
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
  PostCommenter,
  Message,
  MessageThread
)

export default orm
