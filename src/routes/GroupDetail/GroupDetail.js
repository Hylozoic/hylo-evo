import cx from 'classnames'
import { get, keyBy, map, trim } from 'lodash'
import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import FarmGroupDetailBody from 'components/FarmGroupDetailBody'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import Pillbox from 'components/Pillbox'
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
import { TYPE_FARM, TYPE_NORMAL } from 'util/constants'
import { inIframe } from 'util/index'
import { groupDetailUrl, groupUrl, personUrl } from 'util/navigation'

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
    if (get(prevProps, 'group.id') !== get(this.props, 'group.id')) {
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
      isAboutCurrentGroup,
      isMember,
      location,
      moderators,
      onClose,
      pending,
      routeParams
    } = this.props

    if (!group && !pending) return <NotFound />
    if (pending) return <Loading />

    const fullPage = !onClose

    return <div className={cx({ [g.group]: true, [g.fullPage]: fullPage, [g.isAboutCurrentGroup]: isAboutCurrentGroup })}>
      <div styleName='g.groupDetailHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
        {onClose &&
          <a styleName='g.close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='g.groupTitleContainer'>
          <img src={group.avatarUrl || DEFAULT_AVATAR} styleName='g.groupAvatar' />
          <div>
            <div styleName='g.groupTitle'>{isAboutCurrentGroup && <span>About </span>}{group.name}</div>
            <div styleName='g.groupContextInfo'>
              {!isAboutCurrentGroup && <div>
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
              </div>}
              <span styleName='g.group-location'>{group.location}</span>
            </div>
          </div>
        </div>
        <div styleName='g.headerBackground' />
      </div>
      <div styleName='g.groupDetailBody'>
        {group.type === TYPE_NORMAL && this.normalGroupBody()}
        {group.type === TYPE_FARM && <FarmGroupDetailBody isMember={isMember} group={group} currentUser={currentUser} routeParams={routeParams} />}
        { isAboutCurrentGroup || group.type === TYPE_FARM
          ? <div styleName='g.aboutCurrentGroup'>
            <h3>{group.moderatorDescriptorPlural || 'Moderators'}</h3>
            <div styleName='g.moderators'>
              {moderators.map(p => <Link to={personUrl(p.id, group.slug)} key={p.id} styleName='g.moderator'>
                <Avatar url={personUrl(p.id, group.slug)} avatarUrl={p.avatarUrl} medium />
                <span>{p.name}</span>
              </Link>)}
            </div>
            <h3>Privacy settings</h3>
            <div styleName='g.privacySetting'>
              <Icon name={visibilityIcon(group.visibility)} styleName='g.settingIcon' />
              <p>{visibilityString(group.visibility)} - {visibilityDescription(group.visibility)}</p>
            </div>
            <div styleName='g.privacySetting'>
              <Icon name={accessibilityIcon(group.accessibility)} styleName='g.settingIcon' />
              <p>{accessibilityString(group.accessibility)} - {accessibilityDescription(group.accessibility)}</p>
            </div>
          </div>
          : !currentUser
            ? <div styleName='g.signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='g.requestButton'>Signup or Login to connect with <span styleName='g.requestGroup'>{group.name}</span></Link></div>
            : isMember
              ? <div styleName='g.existingMember'>You are a member of <Link to={groupUrl(group.slug)}>{group.name}</Link>!</div>
              : this.renderGroupDetails()
        }
      </div>
      <SocketSubscriber type='group' id={group.id} />
    </div>
  }

  normalGroupBody () {
    const {
      canModerate,
      group,
      isAboutCurrentGroup
    } = this.props

    const topics = group && group.groupTopics

    return (
      <>
        {isAboutCurrentGroup &&
          !group.description &&
          canModerate
          ?
            <div styleName='g.no-description'>
              <div>
                <h4>Your group doesn't have a description</h4>
                <p>Add a description, location, suggested topics and more in your group settings</p>
                <Link to={groupUrl(group.slug, 'settings')}>Add a group description</Link>
              </div>
            </div>
          :
            <div styleName='g.groupDescription'>
              {group.description}
            </div>}

        {!isAboutCurrentGroup && topics && topics.length
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
          : ''}
      </>
    )
  }

  normalGroupDetails () {
    const { group } = this.props
    return (
      <div styleName='g.groupDetails'>
        <div styleName='g.detailContainer'>
          <div styleName='g.groupSubtitle'>Recent Posts</div>
          <div styleName='g.detail'>
            <Icon name='BadgeCheck' />
            <span styleName='g.detailText'>Only members of this group can see posts</span>
          </div>
        </div>
        <div styleName='g.detailContainer'>
          <div styleName='g.groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? 'Members' : 'Member'}</div>
          {get(group, 'settings.publicMemberDirectory')
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
    )
  }

  renderGroupDetails () {
    const { addSkill, currentUser, group, joinRequests, onClose, removeSkill, routeParams } = this.props
    const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')

    return ( // half of this could be shifted to farm specific widgets
      <div>
        {this.normalGroupDetails()}
        <JoinSection
          addSkill={addSkill}
          currentUser={currentUser}
          fullPage={!onClose}
          group={group}
          groupsWithPendingRequests={groupsWithPendingRequests}
          joinGroup={this.joinGroup}
          requestToJoinGroup={this.requestToJoinGroup}
          removeSkill={removeSkill}
          routeParams={routeParams}
        />
      </div>
    )
  }
}

export function JoinSection ({ addSkill, currentUser, fullPage, group, groupsWithPendingRequests, joinGroup, requestToJoinGroup, removeSkill, routeParams }) {
  const [questionAnswers, setQuestionAnswers] = useState(group.joinQuestions.map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(questionAnswers.length === 0)

  const setAnswer = (index) => (event) => {
    const answerValue = event.target.value
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers]
      newAnswers[index].answer = answerValue
      setAllQuestionsAnswered(newAnswers.every(a => trim(a.answer).length > 0))
      return newAnswers
    })
  }

  const hasPendingRequest = groupsWithPendingRequests[group.id]

  return (
    <div styleName={group.accessibility === GROUP_ACCESSIBILITY.Open ? 'g.requestBarBordered' : 'g.requestBarBorderless'}>
      {group.suggestedSkills && group.suggestedSkills.length > 0 &&
        <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />
      }
      { group.prerequisiteGroups && group.prerequisiteGroups.length > 0
        ? <div styleName='g.prerequisiteGroups'>
          {group.prerequisiteGroups.length === 1 ? <h4>{group.name} is only accessible to members of {group.prerequisiteGroups.map(prereq => <span key={prereq.id}>{prereq.name}</span>)}</h4> : <h4>{group.name} is only accessible to members of the following groups:</h4>}
          {group.prerequisiteGroups.map(prereq => <div key={prereq.id} styleName='g.prerequisiteGroup'>
            <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} styleName='g.groupDetailHeader g.prereqHeader' style={{ backgroundImage: `url(${prereq.bannerUrl || DEFAULT_BANNER})` }}>
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
            </Link>
            <div styleName='g.cta'>
              To join {group.name} <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} styleName='g.prereqVisitLink'>visit {prereq.name}</Link> and become a member
            </div>
          </div>)}
        </div>
        : group.numPrerequisitesLeft ? 'This group has prerequisite groups you cannot see, you cannot join this group at this time'
          : group.accessibility === GROUP_ACCESSIBILITY.Open
            ? <div styleName='g.requestOption'>
              <div styleName='g.requestHint'>Anyone can join this group!</div>
              {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
                <h3>{q.text}</h3>
                <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder='Type your answer here...' />
              </div>)}
              <div styleName='g.center'>
                <div styleName='g.requestButton' onClick={() => joinGroup(group.id)}>Join <span styleName='g.requestGroup'>{group.name}</span></div>
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
                    <div styleName={cx('g.requestButton', { 'g.disabledButton': !allQuestionsAnswered })} onClick={allQuestionsAnswered ? () => requestToJoinGroup(group.id, questionAnswers) : () => {}}>
                      Request Membership in <span styleName='g.requestGroup'>{group.name}</span>
                    </div>
                  </div>
                </div>
              : <div styleName='g.requestOption'> {/* Closed group */}
                This is group is invitation only
              </div>
      }
    </div>
  )
}

export function SuggestedSkills ({ addSkill, currentUser, group, removeSkill }) {
  const [selectedSkills, setSelectedSkills] = useState(currentUser.skills ? currentUser.skills.toRefArray().map(s => s.id) : [])

  const pills = map(group.suggestedSkills, skill => ({
    ...skill,
    label: skill.name,
    className: selectedSkills.find(s => s === skill.id) ? g.selectedSkill : ''
  }))

  const handleClick = (skillId) => {
    const hasSkill = selectedSkills.includes(skillId)
    if (hasSkill) {
      removeSkill(skillId)
      setSelectedSkills(selectedSkills.filter(s => s !== skillId))
    } else {
      addSkill(group.suggestedSkills.find(s => s.id === skillId).name)
      setSelectedSkills(selectedSkills.concat(skillId))
    }
  }

  return (
    <div styleName='g.joinQuestion'>
      <h4>Which of the following skills &amp; interests are relevant to you?</h4>
      <div styleName='g.skillPills'>
        <Pillbox
          pills={pills}
          handleClick={handleClick}
          editable={false}
        />
      </div>
    </div>
  )
}
