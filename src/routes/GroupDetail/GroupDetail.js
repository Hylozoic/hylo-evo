import cx from 'classnames'
import { get, keyBy, map, trim } from 'lodash'
import React, { Component, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
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
import { groupDetailUrl, groupUrl, personUrl, removeGroupFromUrl } from 'util/navigation'
import g from './GroupDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars

const MAX_DETAILS_LENGTH = 144

export const initialState = {
  errorMessage: undefined,
  successMessage: undefined,
  membership: undefined,
  request: undefined
}

class UnwrappedGroupDetail extends Component {
  static propTypes = {
    closeDetailModal: PropTypes.func,
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

  joinGroup = async (groupId, questionAnswers) => {
    const { joinGroup, group } = this.props

    await joinGroup(groupId, questionAnswers)

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
      routeParams,
      t
    } = this.props
    const fullPage = !getRouteParam('detailGroupSlug', {}, this.props)

    if (!group && !pending) return <NotFound />
    if (pending) return <Loading />

    return (
      <div className={cx({ [g.group]: true, [g.fullPage]: fullPage, [g.isAboutCurrentGroup]: isAboutCurrentGroup })}>
        <Helmet>
          <title>{group.name} | Hylo</title>
          <meta name='description' content={TextHelpers.truncateHTML(group.description, MAX_DETAILS_LENGTH)} />
        </Helmet>

        <div styleName='g.groupDetailHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
          {!fullPage && (
            <a styleName='g.close' onClick={closeDetailModal}><Icon name='Ex' /></a>
          )}
          <div styleName='g.groupTitleContainer'>
            <img src={group.avatarUrl || DEFAULT_AVATAR} styleName='g.groupAvatar' />
            <div>
              <div styleName='g.groupTitle'>{isAboutCurrentGroup && <span>{t('About')}</span>} {group.name}</div>
              <div styleName='g.groupContextInfo'>
                <div>
                  <span styleName='g.group-privacy'>
                    <Icon name={visibilityIcon(group.visibility)} styleName='g.privacy-icon' />
                    <div styleName='g.privacy-tooltip'>
                      <div>{t(visibilityString(group.visibility))} - {t(visibilityDescription(group.visibility))}</div>
                    </div>
                  </span>
                  <span styleName='g.group-privacy'>
                    <Icon name={accessibilityIcon(group.accessibility)} styleName='g.privacy-icon' />
                    <div styleName='g.privacy-tooltip'>
                      <div>{t(accessibilityString(group.accessibility))} - {t(accessibilityDescription(group.accessibility))}</div>
                    </div>
                  </span>
                  <span styleName='g.memberCount'>{group.memberCount} {group.memberCount > 1 ? t('Members') : t('Member')}</span>
                </div>
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
              <h3>{group.moderatorDescriptorPlural || t('Moderators')}</h3>
              <div styleName='g.moderators'>
                {moderators.map(p => (
                  <Link to={personUrl(p.id, group.slug)} key={p.id} styleName='g.moderator'>
                    <Avatar avatarUrl={p.avatarUrl} medium />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            : ''
          }
          <div styleName='g.detailSection'>
            <h3>{t('Privacy settings')}</h3>
            <div styleName='g.privacySetting'>
              <Icon name={visibilityIcon(group.visibility)} styleName='g.settingIcon' />
              <p>{t(visibilityString(group.visibility))} - {t(visibilityDescription(group.visibility))}</p>
            </div>
            <div styleName='g.privacySetting'>
              <Icon name={accessibilityIcon(group.accessibility)} styleName='g.settingIcon' />
              <p>{t(accessibilityString(group.accessibility))} - {t(accessibilityDescription(group.accessibility))}</p>
            </div>
          </div>
          {group.agreements?.length > 0
            ? (
              <div styleName={cx('g.agreements', 'g.detailSection')}>
                <h2>{t('Agreements')}</h2>
                {group.agreements.map((agreement, i) => {
                  return (
                    <div key={i}>
                      <strong>{parseInt(i) + 1}) {agreement.title}</strong>
                      <ClickCatcher>
                        <HyloHTML element='span' html={TextHelpers.markdown(agreement.description)} />
                      </ClickCatcher>
                    </div>
                  )
                })}
              </div>)
            : ''
          }
          {!isAboutCurrentGroup
            ? !currentUser
              ? (
                <div styleName='g.signupButton'>
                  <Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='g.requestButton'>
                    {t('Signup or Login to connect with')}{' '}
                    <span styleName='g.requestGroup'>{group.name}</span>
                  </Link>
                </div>)
              : isMember
                ? (
                  <div styleName='g.existingMember'>
                    {t('You are a member of ')}
                    <Link to={groupUrl(group.slug)}>{group.name}</Link>
                  </div>)
                : this.renderDefaultGroupDetails()
            : ''
          }
        </div>
        <ReactTooltip
          backgroundColor='rgba(35, 65, 91, 1.0)'
          effect='solid'
          delayShow={0}
          id='join-tip'
        />
        <SocketSubscriber type='group' id={group.id} />
      </div>
    )
  }

  defaultGroupBody () {
    const {
      canModerate,
      group,
      isAboutCurrentGroup,
      t
    } = this.props

    // XXX: turning this off for now because topics are random and can be weird. Turn back on when groups have their own #tags
    // const topics = group.groupTopics && group.groupTopics.toModelArray()

    return (
      <>
        {isAboutCurrentGroup && group.aboutVideoUri && (
          <GroupAboutVideoEmbed uri={group.aboutVideoUri} styleName='g.groupAboutVideo' />
        )}
        {isAboutCurrentGroup && (!group.purpose && !group.description) && canModerate
          ? <div styleName='g.no-description'>
            <div>
              <h4>{t('Your group doesn\'t have a description')}</h4>
              <p>{t('Add a description, location, suggested topics and more in your group settings')}</p>
              <Link to={groupUrl(group.slug, 'settings')}>{t('Add a group description')}</Link>
            </div>
          </div>
          : group.purpose || group.description
            ? <div styleName={cx('g.groupDescription', 'g.detailSection')}>
              {group.purpose
                ? <>
                  <h3>{t('Purpose')}</h3>
                  <ClickCatcher>
                    <HyloHTML element='span' html={TextHelpers.markdown(group.purpose)} />
                  </ClickCatcher>
                </>
                : ''}
              {group.description
                ? <>
                  <h3>{t('Description')}</h3>
                  <ClickCatcher>
                    <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
                  </ClickCatcher>
                </>
                : ''}
            </div>
            : ''
        }
        {/* XXX: turning this off for now because topics are random and can be weird. Turn back on when groups have their own #tags
        {!isAboutCurrentGroup && topics && topics.length && (
          <div styleName='g.groupTopics'>
            <div styleName='g.groupSubtitle'>{t('Topics')}</div>
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
          ) */}
      </>
    )
  }

  renderDefaultGroupDetails () {
    const { addSkill, currentUser, group, joinRequests, onClose, removeSkill, routeParams, t } = this.props
    const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')

    // half of this could be shifted to farm specific widgets
    return (
      <div>
        {/* XXX: turned off until we re-add settings for showing recent posts and group directory publicly
        <div styleName='g.groupDetails'>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>{t('Recent Posts')}</div>
            <div styleName='g.detail'>
              <Icon name='BadgeCheck' />
              <span styleName='g.detailText'>{t('Only members of this group can see posts')}</span>
            </div>
          </div>
          <div styleName='g.detailContainer'>
            <div styleName='g.groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? t('Members') : t('Member')}</div>
            {get(group, 'settings.publicMemberDirectory')
              ? <div>{group.members.map(member => {
                return <div key={member.id} styleName='g.avatarContainer'><Avatar avatarUrl={member.avatarUrl} styleName='g.avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='g.detail'>
                <Icon name='Unlock' />
                <span styleName='g.detailText'>{t('Join to see')}</span>
              </div>
            }
          </div>
        </div> */}
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
          t={t}
        />
      </div>
    )
  }
}

export function JoinSection ({ addSkill, currentUser, fullPage, group, groupsWithPendingRequests, joinGroup, requestToJoinGroup, removeSkill, routeParams, t }) {
  const hasPendingRequest = groupsWithPendingRequests[group.id]

  return (
    <div styleName='g.requestBar'>
      {group.suggestedSkills && group.suggestedSkills.length > 0 &&
        <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />
      }
      { group.prerequisiteGroups && group.prerequisiteGroups.length > 0
        ? <div styleName='g.prerequisiteGroups'>
          {group.prerequisiteGroups.length === 1 ? <h4>{group.name}{' '}{t('is only accessible to members of')}{' '}{group.prerequisiteGroups.map(prereq => <span key={prereq.id}>{prereq.name}</span>)}</h4> : <h4>{t('{{group.name}} is only accessible to members of the following groups:', { group })}</h4>}
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
                        <div>{t(visibilityString(prereq.visibility))} - {t(visibilityDescription(prereq.visibility))}</div>
                      </div>
                    </span>
                    <span styleName='g.group-privacy'>
                      <Icon name={accessibilityIcon(prereq.accessibility)} styleName='g.privacy-icon' />
                      <div styleName='g.privacy-tooltip'>
                        <div>{t(accessibilityString(prereq.accessibility))} - {t(accessibilityDescription(prereq.accessibility))}</div>
                      </div>
                    </span>
                    {prereq.location}
                  </div>
                </div>
              </div>
              <div styleName='g.headerBackground' />
            </Link>
            <div styleName='g.cta'>
              {t('To join')}{' '}{group.name} <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} styleName='g.prereqVisitLink'>{t('visit')} {prereq.name}</Link>{' '}{t('and become a member')}

            </div>
          </div>)}
        </div>
        : group.numPrerequisitesLeft
          ? t('This group has prerequisite groups you cannot see, you cannot join this group at this time')
          : group.accessibility === GROUP_ACCESSIBILITY.Open
            ? <JoinQuestionsAndButtons group={group} joinGroup={joinGroup} joinText={t('Join {{group.name}}', { group })} t={t} />
            : group.accessibility === GROUP_ACCESSIBILITY.Restricted
              ? hasPendingRequest
                ? <div styleName='g.requestPending'>{t('Request to join pending')}</div>
                : <JoinQuestionsAndButtons group={group} joinGroup={requestToJoinGroup} joinText={t('Request Membership in {{group.name}}', { group })} t={t} />
              : ''
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

function JoinQuestionsAndButtons ({ group, joinGroup, joinText, t }) {
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

  return (
    <div styleName='g.requestOption'>
      {group.settings.askJoinQuestions && questionAnswers.length > 0 && <div>{t('Please answer the following to join')}:</div>}
      {group.settings.askJoinQuestions && questionAnswers.map((q, index) => (
        <div styleName='g.joinQuestion' key={index}>
          <h3>{q.text}</h3>
          <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={t('Type your answer here...')} />
        </div>
      )
      )}
      <div styleName='g.center'>
        <div
          styleName={cx('g.requestButton', { 'g.disabledButton': !allQuestionsAnswered })}
          onClick={allQuestionsAnswered ? () => joinGroup(group.id, questionAnswers) : () => {}}
          data-tip={!allQuestionsAnswered ? t('You must answer all the questions to join') : ''}
          data-for='join-tip'
        >
          {joinText}
        </div>
      </div>
    </div>
  )
}

export function GroupDetail (props) {
  const history = useHistory()
  const closeDetailModal = () => {
    const newUrl = removeGroupFromUrl(window.location.pathname)
    history.push(newUrl)
  }

  return (
    <UnwrappedGroupDetail {...props} closeDetailModal={closeDetailModal} />
  )
}

export default withTranslation()(GroupDetail)
