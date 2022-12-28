import cx from 'classnames'
import { get, keyBy, map, trim } from 'lodash'
import React, { Component, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { TextHelpers, WebViewMessageTypes } from 'hylo-shared'
import isWebView, { sendMessageToWebView } from 'util/webView'
import getRouteParam from 'store/selectors/getRouteParam'
import Avatar from 'components/Avatar'
import ClickCatcher from 'components/ClickCatcher'
import FarmGroupDetailBody from 'components/FarmGroupDetailBody'
import GroupAboutVideoEmbed from 'components/GroupAboutVideoEmbed'
import HyloHTML from 'components/HyloHTML'
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
  GROUP_TYPES,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'
import { inIframe } from 'util/index'
import { baseUrl, groupDetailUrl, groupUrl, personUrl } from 'util/navigation'
import g from './GroupDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars

export const initialState = {
  errorMessage: undefined,
  successMessage: undefined,
  membership: undefined,
  request: undefined
}

class UnwrappedGroupDetail extends Component {
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

  joinGroup = async () => {
    const { joinGroup, group } = this.props

    await joinGroup(group.id)

    if (isWebView()) {
      // Could be handled better using WebSockets
      sendMessageToWebView(WebViewMessageTypes.JOINED_GROUP, { groupSlug: group.slug })
    }
  }

  requestToJoinGroup = (groupId, questionAnswers) => {
    const { createJoinRequest } = this.props
    createJoinRequest(groupId, questionAnswers)
  }

  render () {
    const {
      currentUser,
      group,
      closeDetailModal,
      isAboutCurrentGroup,
      isMember,
      location,
      moderators,
      pending,
      routeParams
    } = this.props
    const fullPage = !getRouteParam('detailGroupSlug', {}, this.props)

    if (!group && !pending) return <NotFound />
    if (pending) return <Loading />

    return (
      <div className={cx({ [g.group]: true, [g.fullPage]: fullPage, [g.isAboutCurrentGroup]: isAboutCurrentGroup })}>
        <div styleName='g.groupDetailHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
          {!fullPage && (
            <a styleName='g.close' onClick={closeDetailModal}><Icon name='Ex' /></a>
          )}
          <div styleName='g.groupTitleContainer'>
            <img src={group.avatarUrl || DEFAULT_AVATAR} styleName='g.groupAvatar' />
            <div>
              <div styleName='g.groupTitle'>{isAboutCurrentGroup && <span>{this.props.t('About')}</span>}{group.name}</div> {/* TODO: Handle this tranlsation */}
              <div styleName='g.groupContextInfo'>
                {!isAboutCurrentGroup && (
                  <div>
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
                  </div>
                )}
                <span styleName='g.group-location'>{group.location}</span>
              </div>
            </div>
          </div>
          <div styleName='g.headerBackground' />
        </div>
        <div styleName='g.groupDetailBody'>
          {group.type === GROUP_TYPES.default && this.defaultGroupBody()}
          {group.type === GROUP_TYPES.farm && (
            <FarmGroupDetailBody isMember={isMember} group={group} currentUser={currentUser} routeParams={routeParams} />
          )}
          {isAboutCurrentGroup || group.type === GROUP_TYPES.farm
            ? <div styleName='g.aboutCurrentGroup'>
              <h3>{group.moderatorDescriptorPlural || this.props.t('Moderators')}</h3>
              <div styleName='g.moderators'>
                {moderators.map(p => (
                  <Link to={personUrl(p.id, group.slug)} key={p.id} styleName='g.moderator'>
                    <Avatar avatarUrl={p.avatarUrl} medium />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
              <h3>{this.props.t('Privacy settings')}</h3>
              <div styleName='g.privacySetting'>
                <Icon name={visibilityIcon(group.visibility)} styleName='g.settingIcon' />
                <p>{visibilityString(group.visibility)} - {visibilityDescription(group.visibility)}</p>
              </div>
              <div styleName='g.privacySetting'>
                <Icon name={accessibilityIcon(group.accessibility)} styleName='g.settingIcon' />
                <p>{accessibilityString(group.accessibility)} - {accessibilityDescription(group.accessibility)}</p>
              </div>
            </div>
            : ''
          }
          {!isAboutCurrentGroup
            ? !currentUser
              ? <div styleName='g.signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='g.requestButton'>{this.props.t('Signup or Login to connect with <span styleName="g.requestGroup">{{group.name}}</span>', { group })}</Link></div>
              : isMember
                ? <div styleName='g.existingMember'>{this.props.t('You are a member of')} <Link to={groupUrl(group.slug)}>{group.name}</Link>!</div>
                : this.renderDefaultGroupDetails()
            : ''
          } {/* TODO: Handle above translation */}
        </div>
        <SocketSubscriber type='group' id={group.id} />
      </div>
    )
  }

  defaultGroupBody () {
    const {
      canModerate,
      group,
      isAboutCurrentGroup
    } = this.props

    const topics = group && group.groupTopics

    return (
      <>
        {isAboutCurrentGroup && group.aboutVideoUri && (
          <GroupAboutVideoEmbed uri={group.aboutVideoUri} styleName='g.groupAboutVideo' />
        )}
        {isAboutCurrentGroup && !group.description && canModerate
          ? (
            <div styleName='g.no-description'>
              <div>
                <h4>{this.props.t('Your group doesn\'t have a description')}</h4>
                <p>{this.props.t('Add a description, location, suggested topics and more in your group settings')}</p>
                <Link to={groupUrl(group.slug, 'settings')}>{this.props.t('Add a group description')}</Link>
              </div>
            </div>
          ) : (
            <div styleName='g.groupDescription'>
              <ClickCatcher>
                <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
              </ClickCatcher>
            </div>
          )}
        {!isAboutCurrentGroup && topics && topics.length && (
          <div styleName='g.groupTopics'>
            <div styleName='g.groupSubtitle'>{this.props.t('Topics')}</div>
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
        )}
      </>
    )
  }

  renderDefaultGroupDetails () {
    const { addSkill, currentUser, group, joinRequests, onClose, removeSkill, routeParams } = this.props
    const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')

    // half of this could be shifted to farm specific widgets
    return (
      <div>
        <div styleName='g.groupDetails'>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>{this.props.t('Recent Posts')}</div>
            <div styleName='g.detail'>
              <Icon name='BadgeCheck' />
              <span styleName='g.detailText'>{this.props.t('Only members of this group can see posts')}</span>
            </div>
          </div>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? this.props.t('Members') : this.props.t('Member')}</div>
            {get(group, 'settings.publicMemberDirectory')
              ? <div>{group.members.map(member => {
                return <div key={member.id} styleName='g.avatarContainer'><Avatar avatarUrl={member.avatarUrl} styleName='g.avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='g.detail'>
                <Icon name='Unlock' />
                <span styleName='g.detailText'>{this.props.t('Join to see')}</span>
              </div>
            }
          </div>
        </div>
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
          {group.prerequisiteGroups.length === 1 ? <h4>{group.name} is only accessible to members of {group.prerequisiteGroups.map(prereq => <span key={prereq.id}>{prereq.name}</span>)}</h4> : <h4>{this.props.t('{group.name} is only accessible to members of the following groups:', { group })}</h4>} {/* TODO: Handle translation */}
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
              To join {group.name} <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} styleName='g.prereqVisitLink'>visit {prereq.name}</Link> and become a member {/* TODO: Handle this translation */ }

            </div>
          </div>)}
        </div>
        : group.numPrerequisitesLeft ? this.props.t('This group has prerequisite groups you cannot see, you cannot join this group at this time')
          : group.accessibility === GROUP_ACCESSIBILITY.Open
            ? <div styleName='g.requestOption'>
              <div styleName='g.requestHint'>{this.props.t('Anyone can join this group!')}</div>
              {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
                <h3>{q.text}</h3>
                <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={this.props.t('Type your answer here...')} />
              </div>)}
              <div styleName='g.center'>
                <div styleName='g.requestButton' onClick={() => joinGroup(group.id)}>{this.props.t('Join <span styleName="g.requestGroup">{{group.name}}</span>', { group })}</div>
              </div>
            </div>
            : group.accessibility === GROUP_ACCESSIBILITY.Restricted
              ? hasPendingRequest
                ? <div styleName='g.requestPending'>{this.props.t('Request to join pending')}</div>
                : <div styleName='g.requestOption'> {/* this.props.t('Restricted group, no request pending') */}
                  {group.settings.askJoinQuestions && questionAnswers.map((q, index) => <div styleName='g.joinQuestion' key={index}>
                    <h3>{q.text}</h3>
                    <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={this.props.t('Type your answer here...')} />
                  </div>)}
                  <div styleName='g.center'>
                    <div styleName={cx('g.requestButton', { 'g.disabledButton': !allQuestionsAnswered })} onClick={allQuestionsAnswered ? () => requestToJoinGroup(group.id, questionAnswers) : () => {}}>
                      {this.props.t('Request Membership in <span styleName="g.requestGroup">{{group.name}}</span>', { group })}
                    </div>
                  </div>
                </div>
              : <div styleName='g.requestOption'> {/* Closed group */}
                {this.props.t('This is group is invitation only')}
              </div>
      }
    </div>
  )
}

export function SuggestedSkills ({ addSkill, currentUser, group, removeSkill }) {
  const [selectedSkills, setSelectedSkills] = useState(currentUser.skills ? currentUser.skills.toRefArray().map(s => s.id) : [])
  const { t } = useTranslation()

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
      <h4>{t('Which of the following skills & interests are relevant to you?')}</h4>
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

export function GroupDetail (props) {
  const history = useHistory()
  const location = useLocation()
  const closeDetailModal = () => {
    // `detailsGroupSlug` is not currently used in any URL generation, `null`'ing
    // it here in case that changes, and it's otherwise descriptive of the intent.
    history.push(
      baseUrl({ ...props.routeParams, detailGroupSlug: null }) + location.search
    )
  }

  return (
    <UnwrappedGroupDetail {...props} closeDetailModal={closeDetailModal} />
  )
}

export default withTranslation()(UnwrappedGroupDetail)
