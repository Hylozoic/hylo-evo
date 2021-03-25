import cx from 'classnames'
import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import { DEFAULT_AVATAR, DEFAULT_BANNER, GROUP_ACCESSIBILITY } from 'store/models/Group'
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
        if (membership) successMessage = <span>You have joined <Link to={groupUrl(group.slug)}>{group.name}</Link></span>
        return this.setState({ errorMessage, successMessage, membership })
      })
  }

  requestToJoinGroup = (questionAnswers) => {
    const { createJoinRequest } = this.props
    createJoinRequest(questionAnswers)
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
      isMember,
      location,
      pending,
      onClose
    } = this.props

    if (!group && !pending) return <NotFound />
    if (pending) return <Loading />

    const topics = group && group.groupTopics

    return <div className={cx({ [g.group]: true, [g.fullPage]: !onClose })}>
      <div styleName='g.groupDetailHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
        {onClose &&
          <a styleName='g.close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='g.groupTitleContainer'>
          <img src={group.avatarUrl || DEFAULT_AVATAR} height='50px' width='50px' />
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
            ? <div styleName='g.existingMember'>You are a member of <Link to={groupUrl(group.slug)}>{group.name}</Link>!</div>
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
                return <div key={member.id} styleName='g.avatarContainer'><Avatar avatarUrl={member.avatarUrl} styleName='g.avatar' /><span>{member.name}</span></div>
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
  const [questionAnswers, setQuestionAnswers] = useState(group.joinQuestions.map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))

  const setAnswer = (index) => (event) => {
    const answerValue = event.target.value
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [ ...prevAnswers ]
      newAnswers[index].answer = answerValue
      return newAnswers
    })
  }

  return (
    <div styleName={group.accessibility === GROUP_ACCESSIBILITY.Open ? 'g.requestBarBordered' : 'g.requestBarBorderless'}>
      { group.accessibility === GROUP_ACCESSIBILITY.Open
        ? <div styleName='g.requestOption'>
          <div styleName='g.requestHint'>Anyone can join this group!</div>
          <div styleName='g.requestButton' onClick={joinGroup}>Join <span styleName='g.requestGroup'>{group.name}</span></div>
        </div>
        : <div styleName='g.requestOption'>
          {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
            <h3>{q.text}</h3>
            <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder='Type your answer here...' />
          </div>)}
          <div styleName='g.requestButton' onClick={() => requestToJoinGroup(questionAnswers)}>Request Membership in <span styleName='g.requestGroup'>{group.name}</span></div>
        </div>
      }
    </div>
  )
}

export function Message ({ errorMessage, successMessage, request }) {
  const message = request ? 'Your request to join this group is pending moderator approval.' : (errorMessage || successMessage)
  return (<div styleName='g.message'>{message}</div>)
}
