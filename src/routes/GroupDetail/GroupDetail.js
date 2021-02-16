import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import { inIframe } from 'util/index'
import { groupUrl } from 'util/navigation'

import g from './GroupDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'

export const initialState = {
  errorMessage: undefined,
  successMessage: undefined,
  membership: undefined,
  request: undefined
}
export default class GroupDetail extends Component {
  static propTypes = {
    group: PropTypes.object,
    routeParams: PropTypes.object,
    currentUser: PropTypes.object,
    fetchGroup: PropTypes.func
  }

  state = initialState

  componentDidMount () {
    this.onGroupChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.slug && this.props.slug !== prevProps.slug) {
      this.onGroupChange()
    }
  }

  onGroupChange = () => {
    this.props.fetchGroup()
    this.props.fetchJoinRequests()

    this.setState(initialState)
  }

  joinGroup = () => {
    const { group = {}, joinGroup } = this.props

    joinGroup()
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error joining ${group.name}.`
        const membership = get(res, 'payload.data')
        if (membership) successMessage = `You have joined ${group.name}.`
        return this.setState({ errorMessage, successMessage, membership })
      })
  }

  requestToJoinGroup = () => {
    const { requestToJoinGroup } = this.props

    requestToJoinGroup()
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error sending your join request.`
        const request = get(res, 'payload.data')
        if (request) successMessage = `Your join request is pending.`
        return this.setState({ errorMessage, successMessage, request })
      })
  }

  render () {
    const {
      group,
      currentUser,
      location,
      pending,
      onClose
    } = this.props

    if (!group && !pending) return <NotFound />
    if (pending) return <Loading />

    const topics = group && group.groupTopics

    const isMember = (currentUser && currentUser.memberships) ? currentUser.memberships.toModelArray().find(m => m.group.id === group.id) : false

    return <div styleName='g.group'>
      <div styleName='g.groupDetailHeader' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
        {onClose &&
          <a styleName='g.close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='g.groupTitleContainer'>
          <img src={group.avatarUrl} height='50px' width='50px' />
          <div styleName='g.groupTitle'>{group.name}</div>
        </div>
      </div>
      <div styleName='g.groupDetailBody'>
        <div styleName='g.groupDescription'>{group.description}</div>
        { topics && topics.length
          ? <div styleName='g.groupTopics'>
            <div styleName='g.groupSubtitle'>Topics</div>
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
        { !currentUser
          ? <div styleName='g.signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='g.requestButton'>Signup or Login to post in <span styleName='g.requestGroup'>{group.name}</span></Link></div>
          : isMember
            ? <div styleName='g.existingMember'>You are already a member of <Link to={groupUrl(group.slug)}>{group.name}</Link>!</div>
            : this.renderGroupDetails()
        }
      </div>
      <SocketSubscriber type='group' id={group.id} />
    </div>
  }

  renderGroupDetails () {
    const { group, currentUser, joinRequests } = this.props
    const { errorMessage, successMessage } = this.state
    const usersWithPendingRequests = keyBy(joinRequests, 'user.id')
    const request = currentUser ? usersWithPendingRequests[currentUser.id] : false
    const displayMessage = errorMessage || successMessage || request
    return (
      <div>
        <div styleName='g.groupDetails'>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>Recent Posts</div>
            <div styleName='g.detail'>
              <Icon name='BadgeCheck' />
              <span styleName='g.detailText'>Only members of this group can see posts</span>
            </div>
          </div>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? `Members` : `Member`}</div>
            {group.settings.publicMemberDirectory
              ? <div>{group.members.map(member => {
                return <div key={member.id} styleName='g.avatarContainer'><Avatar avatarUrl={member.avatarUrl} url={member.avatarUrl} styleName='g.avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='g.detail'>
                <Icon name='Unlock' />
                <span styleName='g.detailText'>Join to see</span>
              </div>
            }
          </div>
        </div>
        { displayMessage
          ? <Message errorMessage={errorMessage} successMessage={successMessage} request={request} />
          : <Request group={group} joinGroup={this.joinGroup} requestToJoinGroup={this.requestToJoinGroup} />
        }
      </div>
    )
  }
}

export function Request ({ group, joinGroup, requestToJoinGroup }) {
  return (
    <div styleName={group.accessibility === GROUP_ACCESSIBILITY.Open ? 'g.requestBarBordered' : 'g.requestBarBorderless'}>
      { group.accessibility === GROUP_ACCESSIBILITY.Open
        ? <div styleName='g.requestOption'>
          <div styleName='g.requestHint'>Anyone can join this group!</div>
          <div styleName='g.requestButton' onClick={joinGroup}>Join <span styleName='g.requestGroup'>{group.name}</span></div>
        </div>
        : <div styleName='g.requestOption'><div styleName='g.requestButton' onClick={requestToJoinGroup}>Request Membership in <span styleName='g.requestGroup'>{group.name}</span></div></div>
      }
    </div>
  )
}

export function Message ({ errorMessage, successMessage, request }) {
  const message = request ? 'You have already requested to join this group.' : (errorMessage || successMessage)
  return (<div styleName='g.message'>{message}</div>)
}
