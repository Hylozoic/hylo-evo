import { ORM } from 'redux-orm'
import './Model.extension'
import Comment from './Comment'
import Community, { CommunityModerator } from './Community'
import FeedItem from './FeedItem'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import Post, { PostFollower, PostCommenter } from './Post'
import Vote from './Vote'

export const orm = new ORM()
orm.register(
  Comment,
  Community,
  CommunityModerator,
  FeedItem,
  Me,
  Membership,
  Person,
  Post,
  PostFollower,
  PostCommenter,
  Vote
)

export default orm
