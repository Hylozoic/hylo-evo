import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import c from './CommunityDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'

export const initialState = {
  errorMessage: undefined,
  successMessage: undefined,
  membership: undefined,
  request: undefined
}
export default class CommunityDetail extends Component {
  static propTypes = {
    community: PropTypes.object,
    routeParams: PropTypes.object,
    currentUser: PropTypes.object,
    fetchCommunity: PropTypes.func
  }

  state = initialState

  componentDidMount () {
    this.onCommunityIdChange()
    this.props.fetchJoinRequests()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onCommunityIdChange()
    }
  }

  onCommunityIdChange = () => {
    this.props.fetchCommunity()
    this.props.fetchJoinRequests()
    this.setState(initialState)
  }

  joinCommunity = () => {
    const { community = {}, currentUser = {}, joinCommunity } = this.props

    joinCommunity(community.id, currentUser.id)
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error joining ${community.name}.`
        const membership = get(res, 'payload.data')
        if (membership) successMessage = `You have joined ${community.name}.`
        return this.setState({ errorMessage, successMessage, membership })
      })
  }

  requestToJoinCommunity = () => {
    const { community = {}, currentUser = {}, requestToJoinCommunity } = this.props

    requestToJoinCommunity(community.id, currentUser.id)
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error sending your join request.`
        const request = get(res, 'payload.data')
        if (request) successMessage = `Your membership request is pending.`
        return this.setState({ errorMessage, successMessage, request })
      })
  }

  render () {
    const {
      community,
      currentUser,
      pending,
      onClose
    } = this.props

    if (!community && !pending) return <NotFound />
    if (pending) return <Loading />

    const topics = community && community.communityTopics

    const isMember = (community.members || []).find(m => m.id === currentUser.id)

    return <div styleName='c.community'>
      <div styleName='c.communityDetailHeader' style={{ backgroundImage: `url(${community.bannerUrl})` }}>
        {onClose &&
          <a styleName='c.close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='c.communityTitleContainer'>
          <img src={community.avatarUrl} height='50px' width='50px' />
          <div styleName='c.communityTitle'>{community.name}</div>
        </div>
      </div>
      <div styleName='c.communityDetailBody'>
        <div styleName='c.communityDescription'>{community.description}</div>
        { topics && topics.length
          ? <div styleName='c.communityTopics'>
            <div styleName='c.communitySubtitle'>Topics</div>
            {topics.slice(0, 10).map(topic => {
              return (
                <span
                  key={'topic_' + topic.id}
                  styleName='m.topicButton'
                >
                  <span styleName='m.topicCount'>{topic.postsTotal}</span> #{topic.name}
                </span>
              )
            })}
          </div>
          : ''
        }
        { isMember
          ? <div styleName='c.existingMember'>You are already a member of <Link to={`/c/${community.slug}`}>{community.name}</Link>!</div>
          : this.renderCommunityDetails()
        }
      </div>
      <SocketSubscriber type='community' id={community.id} />
    </div>
  }

  renderCommunityDetails () {
    const { community, currentUser, joinRequests } = this.props
    const { errorMessage, successMessage } = this.state
    const usersWithPendingRequests = keyBy(joinRequests, 'user.id')
    const request = usersWithPendingRequests[currentUser.id]
    const displayMessage = errorMessage || successMessage || request
    return (
      <div>
        <div styleName='c.communityDetails'>
          <div styleName='c.detailContainer'>
            <div styleName='c.communitySubtitle'>Recent Posts</div>
            <div styleName='c.detail'>
              <Icon name='BadgeCheck' />
              <span styleName='c.detailText'>Only members of this community can see posts</span>
            </div>
          </div>
          <div styleName='c.detailContainer'>
            <div styleName='c.communitySubtitle'>{community.memberCount} {community.memberCount > 1 ? `Members` : `Member`}</div>
            {community.publicMemberDirectory
              ? <div>{community.members.map(member => {
                return <div key={member.id} styleName='c.avatarContainer'><Avatar avatarUrl={member.avatarUrl} url={member.avatarUrl} styleName='c.avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='c.detail'>
                <Icon name='Unlock' />
                <span styleName='c.detailText'>Join to see</span>
              </div>
            }
          </div>
        </div>
        { displayMessage
          ? <Message errorMessage={errorMessage} successMessage={successMessage} request={request} />
          : <Request community={community} joinCommunity={this.joinCommunity} requestToJoinCommunity={this.requestToJoinCommunity} />
        }
      </div>
    )
  }
}

export function Request ({ community, joinCommunity, requestToJoinCommunity }) {
  return (
    <div styleName={community.isAutoJoinable ? 'c.requestBarBordered' : 'c.requestBarBorderless'}>
      { community.isAutoJoinable
        ? <div styleName='c.requestOption'>
          <div styleName='c.requestHint'>Anyone can join this community!</div>
          <div styleName='c.requestButton' onClick={joinCommunity}>Join <span styleName='c.requestCommunity'>{community.name}</span></div>
        </div>
        : <div styleName='c.requestOption'><div styleName='c.requestButton' onClick={requestToJoinCommunity}>Request Membership in <span styleName='c.requestCommunity'>{community.name}</span></div></div>
      }
    </div>
  )
}

export function Message ({ errorMessage, successMessage, request }) {
  const message = request ? 'You have already requested to join this community.' : (errorMessage || successMessage)
  return (<div styleName='c.message'>{message}</div>)
}
