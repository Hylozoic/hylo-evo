import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Comment from './Comment'
import Community, { CommunityModerator } from './Community'
import CommunityTopic from './CommunityTopic'
import FeedItem from './FeedItem'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import Message from './Message'
import MessageThread from './MessageThread'
import Notification from './Notification'
import Post, { PostFollower, PostCommenter } from './Post'
import Topic from './Topic'
import TopicSubscription from './TopicSubscription'
import Vote from './Vote'

export const orm = new ORM()
orm.register(
  Activity,
  Comment,
  Community,
  CommunityModerator,
  CommunityTopic,
  FeedItem,
  Me,
  Membership,
  Message,
  MessageThread,
  Notification,
  Person,
  Post,
  PostFollower,
  PostCommenter,
  Topic,
  TopicSubscription,
  Vote
)

export default orm
