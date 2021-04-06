import cx from 'classnames'
import { get, keyBy } from 'lodash'
import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import {
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  GROUP_ACCESSIBILITY,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'
import { inIframe } from 'util/index'
import { groupDetailUrl, groupUrl } from 'util/navigation'

import g from './GroupDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars

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
    this.props.fetchJoinRequests()
  }

  componentDidUpdate (prevProps) {
    if (this.props.slug && this.props.slug !== prevProps.slug) {
      this.onGroupChange()
    }
  }

  onGroupChange = () => {
    this.props.fetchGroup()

    this.setState(initialState)
  }

  joinGroup = (groupId) => () => {
    const { joinGroup } = this.props
    joinGroup(groupId)
  }

  requestToJoinGroup = (groupId, questionAnswers) => () => {
    const { createJoinRequest } = this.props
    createJoinRequest(groupId, questionAnswers)
  }

  render () {
    const {
      currentUser,
      group,
      isMember,
      location,
      onClose,
      pending
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
          <div>
            <div styleName='g.groupTitle'>{group.name}</div>
            <div styleName='g.groupContextInfo'>
              <span styleName='g.group-privacy'>
                <Icon name={visibilityIcon(group.visibility)} styleName='g.privacy-icon' />
                <div styleName='g.privacy-tooltip'>
                  <div>{visibilityString(group.visibility)} - {visibilityDescription(group.visibility)}</div>
                </div>
              </span>
              <span styleName='g.group-privacy'>
                <Icon name={accessibilityIcon(group.accessibility)} styleName='g.privacy-icon' />
                <div styleName='g.privacy-tooltip'>
                  <div>{accessibilityString(group.accessibility)} - {accessibilityDescription(group.accessibility)}</div>
                </div>
              </span>
              {group.location}
            </div>
          </div>
        </div>
        <div styleName='g.headerBackground' />
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
          ? <div styleName='g.signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='g.requestButton'>Signup or Login to connect with <span styleName='g.requestGroup'>{group.name}</span></Link></div>
          : isMember
            ? <div styleName='g.existingMember'>You are a member of <Link to={groupUrl(group.slug)}>{group.name}</Link>!</div>
            : this.renderGroupDetails()
        }
      </div>
      <SocketSubscriber type='group' id={group.id} />
    </div>
  }

  renderGroupDetails () {
    const { group, joinRequests, routeParams } = this.props
    const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')
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
            {get('settings.publicMemberDirectory', group)
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
        <JoinSection
          group={group}
          groupsWithPendingRequests={groupsWithPendingRequests}
          joinGroup={this.joinGroup}
          requestToJoinGroup={this.requestToJoinGroup}
          routeParams={routeParams}
        />
      </div>
    )
  }
}

export function JoinSection ({ group, groupsWithPendingRequests, joinGroup, requestToJoinGroup, routeParams, topLevel = true }) {
  const [questionAnswers, setQuestionAnswers] = useState(group.joinQuestions.map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))

  const setAnswer = (index) => (event) => {
    const answerValue = event.target.value
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [ ...prevAnswers ]
      newAnswers[index].answer = answerValue
      return newAnswers
    })
  }

  const hasPendingRequest = groupsWithPendingRequests[group.id]

  return (
    <div styleName={group.accessibility === GROUP_ACCESSIBILITY.Open ? 'g.requestBarBordered' : 'g.requestBarBorderless'}>
      { group.prerequisiteGroups && group.prerequisiteGroups.length > 0
        ? topLevel
          ? <div styleName='g.prerequisiteGroups'>
            {group.prerequisiteGroups.length === 1 ? <h4>{group.name} is only accessible to members of {group.prerequisiteGroups.map(prereq => <span key={prereq.id}>{prereq.name}</span>)}</h4> : <h4>{group.name} is only accessible to members of the following groups:</h4>}
            {group.prerequisiteGroups.map(prereq => <div key={prereq.id} styleName='g.prerequisiteGroup'>
              <div styleName='g.groupDetailHeader g.prereqHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
                <div styleName='g.groupTitleContainer'>
                  <img src={prereq.avatarUrl || DEFAULT_AVATAR} height='50px' width='50px' />
                  <div>
                    <div styleName='g.groupTitle'>{prereq.name}</div>
                    <div styleName='g.groupContextInfo'>
                      <span styleName='g.group-privacy'>
                        <Icon name={visibilityIcon(prereq.visibility)} styleName='g.privacy-icon' />
                        <div styleName='g.privacy-tooltip'>
                          <div>{visibilityString(prereq.visibility)} - {visibilityDescription(prereq.visibility)}</div>
                        </div>
                      </span>
                      <span styleName='g.group-privacy'>
                        <Icon name={accessibilityIcon(prereq.accessibility)} styleName='g.privacy-icon' />
                        <div styleName='g.privacy-tooltip'>
                          <div>{accessibilityString(prereq.accessibility)} - {accessibilityDescription(prereq.accessibility)}</div>
                        </div>
                      </span>
                      {prereq.location}
                    </div>
                  </div>
                </div>
                <div styleName='g.headerBackground' />
              </div>
              { prereq.description ? <div styleName='g.prereqDescription'>{prereq.description}</div> : ' ' }
              <JoinSection group={prereq} groupsWithPendingRequests={groupsWithPendingRequests} joinGroup={joinGroup} requestToJoinGroup={requestToJoinGroup} topLevel={false} routeParams={routeParams} />
            </div>)}
          </div>
          : <span>You must join additional groups before joining this one. Please <Link to={groupDetailUrl(group.slug, routeParams)}>visit it</Link> to do so.</span>
        : group.accessibility === GROUP_ACCESSIBILITY.Open
          ? <div styleName='g.requestOption'>
            <div styleName='g.requestHint'>Anyone can join this group!</div>
            {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
              <h3>{q.text}</h3>
              <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder='Type your answer here...' />
            </div>)}
            <div styleName='g.center'>
              <div styleName='g.requestButton' onClick={joinGroup(group.id)}>Join <span styleName='g.requestGroup'>{group.name}</span></div>
            </div>
          </div>
          : group.accessibility === GROUP_ACCESSIBILITY.Restricted
            ? hasPendingRequest
              ? <div styleName='g.requestPending'>Request to join pending</div>
              : <div styleName='g.requestOption'> {/* Restricted group, no request pending */}
                {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
                  <h3>{q.text}</h3>
                  <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder='Type your answer here...' />
                </div>)}
                <div styleName='g.center'>
                  <div styleName='g.requestButton' onClick={requestToJoinGroup(group.id, questionAnswers)}>Request Membership in <span styleName='g.requestGroup'>{group.name}</span></div>
                </div>
              </div>
            : <div styleName='g.requestOption'> {/* Closed group */}
              This is group is invitation only
            </div>
      }
    </div>
  )
}
