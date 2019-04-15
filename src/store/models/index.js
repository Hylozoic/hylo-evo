import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Attachment from './Attachment'
import Comment from './Comment'
import Community, { CommunityModerator } from './Community'
import CommunityTopic from './CommunityTopic'
import EventInvitation from './EventInvitation'
import Invitation from './Invitation'
import LinkPreview from './LinkPreview'
import Me from './Me'
import Membership from './Membership'
import Message from './Message'
import MessageThread from './MessageThread'
import Network, { NetworkModerator } from './Network'
import Notification from './Notification'
import Person from './Person'
import PersonConnection from './PersonConnection'
import Post, { PostFollower, PostCommenter, ProjectMember } from './Post'
import PostMembership from './PostMembership'
import SearchResult from './SearchResult'
import Skill from './Skill'
import Topic from './Topic'
import Vote from './Vote'

export const orm = new ORM()
orm.register(
  Activity,
  Attachment,
  Comment,
  Community,
  CommunityModerator,
  CommunityTopic,
  EventInvitation,
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
  PostCommenter,
  PostFollower,
  PostMembership,
  ProjectMember,
  SearchResult,
  Skill,
  Topic,
  Vote
)

export default orm
