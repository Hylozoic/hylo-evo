import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Comment from './Comment'
import Community, { CommunityModerator } from './Community'
import CommunityTopic from './CommunityTopic'
import LinkPreview from './LinkPreview'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import PersonConnection from './PersonConnection'
import Message from './Message'
import MessageThread from './MessageThread'
import Network from './Network'
import Notification from './Notification'
import Post, { PostFollower, PostCommenter } from './Post'
import SearchResult from './SearchResult'
import Topic from './Topic'
import Vote from './Vote'

export const orm = new ORM()
orm.register(
  Activity,
  Comment,
  Community,
  CommunityModerator,
  CommunityTopic,
  LinkPreview,
  Me,
  Membership,
  Message,
  MessageThread,
  Network,
  Notification,
  Person,
  PersonConnection,
  Post,
  PostFollower,
  PostCommenter,
  SearchResult,
  Topic,
  Vote
)

export default orm
