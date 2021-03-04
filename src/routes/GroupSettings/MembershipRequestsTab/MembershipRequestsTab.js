import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './MembershipRequestsTab.scss' // eslint-disable-line no-unused-vars
import { jollyAxolotl } from 'util/assets'

const { array, func, object } = PropTypes

export default class MembershipRequestsTab extends Component {
  static propTypes = {
    joinRequests: array,
    group: object,
    currentUser: object,
    acceptJoinRequest: func,
    declineJoinRequest: func,
    viewMembers: func
  }

  state = {
    modalVisible: false
  }

  componentDidMount () {
    const { groupId } = this.props
    this.props.fetchJoinRequests(groupId)
  }

  submitAccept = (joinRequestId) => {
    this.props.acceptJoinRequest(joinRequestId)
  }

  submitDecline = (joinRequestId) => {
    this.props.declineJoinRequest(joinRequestId)
  }

  viewMembers = () => {
    const { group } = this.props
    this.props.viewMembers(group.slug)
  }

  render () {
    const { group, joinRequests } = this.props

    if (!joinRequests) return <Loading />

    return joinRequests.length
      ? <NewRequests
        accept={this.submitAccept}
        decline={this.submitDecline}
        group={group}
        joinRequests={joinRequests} />
      : <NoRequests group={group} viewMembers={this.viewMembers} />
  }
}

export function NoRequests ({ group, viewMembers }) {
  return (
    <React.Fragment>
      <div styleName='no-requests'>
        <img src={jollyAxolotl} />
        <br />
        <div>
          <h2>No new join requests</h2>
          We'll notify you by email when someone wants to join <strong>{group.name}</strong>
        </div>
        <Button
          label='View Current Members'
          onClick={viewMembers}
          styleName='view-members'
        />
      </div>
    </React.Fragment>
  )
}

export function NewRequests ({ accept, decline, group, joinRequests }) {
  return (
    <React.Fragment>
      <div styleName='header'>
        <h2>People want to join your group!</h2>
        {/* TODO: For later implementation
        <span styleName='response-time'>Your average response time: 1 day</span> */}
      </div>
      <div styleName='request-list'>
        {joinRequests.map(r => <JoinRequest
          key={r.id}
          accept={accept}
          decline={decline}
          group={group}
          request={r} />)}
      </div>
    </React.Fragment>
  )
}

export function JoinRequest ({ accept, decline, group, request }) {
  const { questionAnswers, user } = request

  console.log(user)

  // Answers to questions no longer being asked by the group
  const otherAnswers = questionAnswers.filter(qa => !group.joinQuestions.find(jq => jq.questionId === qa.question.id))

  return (
    <div styleName='request'>
      <div styleName='requestor'>
        <Avatar avatarUrl={user.avatarUrl} url={`/m/${user.id}`} styleName='requestorAvatar' />
        <div styleName='requestorInfo'>
          <div styleName='name'>{user.name}</div>
          {user.skills.items.length > 0 ? <div styleName='skills'>{user.skills.items.map(({ name }) => <span key={user.id + '-' + name}>#{name}</span>)}</div> : <div>{user.location}</div>}
        </div>
      </div>
      {group.joinQuestions.map(q =>
        <div styleName='answer' key={q.id}>
          <h3>{q.text}</h3>
          <p>{get('answer', questionAnswers.find(qa => qa.question.id === q.questionId)) || <i>Not answered</i>}</p>
        </div>
      )}
      {otherAnswers.map(qa =>
        <div styleName='answer' key={qa.question.id}>
          <h3>{qa.question.text}</h3>
          <p>{qa.answer}</p>
        </div>
      )}
      <div styleName='action-buttons'>
        <div styleName='accept' onClick={() => accept(request.id)}><Icon name='Checkmark' styleName='icon-green' />Welcome</div>
        <div onClick={() => decline(request.id)}><Icon name='Ex' styleName='icon-red' />Decline</div>
      </div>
    </div>
  )
}
