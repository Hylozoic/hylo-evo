import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'
import isWebView from 'util/webView'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './MembershipRequestsTab.module.scss' // eslint-disable-line no-unused-vars
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
  const { t } = useTranslation()
  return (
    <>
      <div className={classes.noRequests}>
        <img src={jollyAxolotl} />
        <br />
        <div>
          <h2>{t('No new join requests')}</h2>
          {t('We\'ll notify you by email when someone wants to join')}{' '}<strong>{group.name}</strong>
        </div>
        {!isWebView() && (
          <Button
            label={t('View Current Members')}
            onClick={viewMembers}
            className={classes.viewMembers}
          />
        )}
      </div>
    </>
  )
}

export function NewRequests ({ accept, decline, group, joinRequests }) {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <div>
        <div className={classes.header}>
          <h2>{t('People want to join your group!')}</h2>
          {/* TODO: For later implementation
          <span className={classes.responseTime}>Your average response time: 1 day</span> */}
        </div>
        <div className={classes.requestList}>
          {joinRequests.map(r => <JoinRequest
            key={r.id}
            accept={accept}
            decline={decline}
            group={group}
            request={r} />)}
        </div>
      </div>
    </React.Fragment>
  )
}

export function JoinRequest ({ accept, decline, group, request }) {
  const { questionAnswers, user } = request
  const { t } = useTranslation()

  // Answers to questions no longer being asked by the group
  const otherAnswers = questionAnswers.filter(qa => !group.joinQuestions.find(jq => jq.questionId === qa.question.id))

  return (
    <div className={classes.request}>
      <div className={classes.requestor}>
        <Avatar avatarUrl={user.avatarUrl} url={personUrl(user.id)} className={classes.requestorAvatar} />
        <div className={classes.requestorInfo}>
          <div className={classes.name}>{user.name}</div>
          {user.skills.items.length > 0 ? <div className={classes.skills}>{user.skills.items.map(({ name }) => <span key={user.id + '-' + name}>#{name}</span>)}</div> : <div>{user.location}</div>}
        </div>
      </div>
      {group.joinQuestions.map(q =>
        <div className={classes.answer} key={q.id}>
          <h3>{q.text}</h3>
          <p>{get('answer', questionAnswers.find(qa => qa.question.id === q.questionId)) || <i>{t('Not answered')}</i>}</p>
        </div>
      )}
      {otherAnswers.map(qa =>
        <div className={classes.answer} key={qa.question.id}>
          <h3>{qa.question.text}</h3>
          <p>{qa.answer}</p>
        </div>
      )}
      <div className={classes.actionButtons}>
        <div className={cx(classes.accept, classes.iconGreen)} onClick={() => accept(request.id)}><Icon name='Checkmark' />{t('Welcome')}</div>
        <div onClick={() => decline(request.id)}><Icon name='Ex' className={classes.iconRed} />{t('Decline')}</div>
      </div>
    </div>
  )
}
