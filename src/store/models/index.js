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
import Network, { NetworkModerator } from './Network'
import Notification from './Notification'
import Post, { PostFollower, PostCommenter } from './Post'
import SearchResult from './SearchResult'
import Skill from './Skill'
import Topic from './Topic'
import Vote from './Vote'
import Invitation from './Invitation'

export const orm = new ORM()
orm.register(
  Activity,
  Comment,
  Community,
  CommunityModerator,
  CommunityTopic,
  Invitation,
  LinkPreview,
  Me,
  Membership,
  Message,
  MessageThread,
  Network,
  NetworkModerator,
  Notification,
  Person,
  PersonConnection,
  Post,
  PostFollower,
  PostCommenter,
  SearchResult,
  Skill,
  Topic,
  Vote
)

export default orm
