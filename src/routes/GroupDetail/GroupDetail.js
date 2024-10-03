import cx from 'classnames'
import { keyBy, map, trim, get } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
// import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { TextHelpers, WebViewMessageTypes } from 'hylo-shared'
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
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import { FETCH_GROUP_DETAILS, RESP_ADMINISTRATION } from 'store/constants'
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
import presentGroup from 'store/presenters/presentGroup'
import getMe from 'store/selectors/getMe'
import { useGetJoinRequests } from 'hooks/useGetJoinRequests'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import { inIframe } from 'util/index'
import { groupDetailUrl, groupUrl, personUrl, removeGroupFromUrl } from 'util/navigation'
import isWebView, { sendMessageToWebView } from 'util/webView'

import {
  createJoinRequest,
  fetchJoinRequests,
  joinGroup
} from './GroupDetail.store'

import g from './GroupDetail.module.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.module.scss' // eslint-disable-line no-unused-vars

const MAX_DETAILS_LENGTH = 144

// export const initialState = {
//   errorMessage: undefined,
//   successMessage: undefined,
//   membership: undefined,
//   request: undefined
// }

function GroupDetail () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const routeParams = useParams()
  const { t } = useTranslation()

  const currentUser = useSelector(getMe)
  const groupSelector = useSelector(state => getGroupForSlug(state, routeParams.detailGroupSlug || routeParams.groupSlug))
  const group = useMemo(() => presentGroup(groupSelector), [groupSelector])
  const slug = get(group, 'slug')
  const isAboutCurrentGroup = routeParams.groupSlug === routeParams.detailGroupSlug
  const myMemberships = useSelector(state => getMyMemberships(state))
  const isMember = useMemo(() => group && currentUser ? myMemberships.find(m => m.group.id === group.id) : false, [group, currentUser, myMemberships])
  const joinRequests = useGetJoinRequests()
  const stewards = group && group.stewards
  const responsibilities = useSelector(state => getResponsibilitiesForGroup(state, { person: currentUser, groupId: group?.id }))
  const responsibilityTitles = useMemo(() => responsibilities.map(r => r.title), [responsibilities])
  const pending = useSelector(state => state.pending[FETCH_GROUP_DETAILS])

  // const [state, setState] = useState(initialState)

  const fetchGroup = useCallback(() => {
    dispatch(fetchGroupDetails({ slug, withWidgets: true, withPrerequisites: !!currentUser }))
  }, [dispatch, slug, currentUser])

  const joinGroupHandler = useCallback(async (groupId, questionAnswers) => {
    await dispatch(joinGroup(groupId, questionAnswers.map(q => ({ questionId: q.questionId, answer: q.answer }))))
    if (isWebView()) {
      sendMessageToWebView(WebViewMessageTypes.JOINED_GROUP, { groupSlug: group.slug })
    }
  }, [dispatch, group])

  const requestToJoinGroup = useCallback((groupId, questionAnswers) => {
    dispatch(createJoinRequest(groupId, questionAnswers.map(q => ({ questionId: q.questionId, answer: q.answer }))))
  }, [dispatch])

  useEffect(() => {
    console.log('useEffect fetchGroup')
    dispatch(fetchJoinRequests())
    dispatch(fetchForCurrentUser())
  }, [dispatch])

  useEffect(() => {
    console.log('useEffect fetchGroup 2', group?.id)
    fetchGroup()
  }, [group?.id])

  const closeDetailModal = () => {
    const newUrl = removeGroupFromUrl(window.location.pathname)
    navigate(newUrl)
  }

  const fullPage = !routeParams.detailGroupSlug

  if (!group && !pending) return <NotFound />
  if (pending) return <Loading />

  const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')

  return (
    <div className={cx({ [g.group]: true, [g.fullPage]: fullPage, [g.isAboutCurrentGroup]: isAboutCurrentGroup })}>
      <Helmet>
        <title>{group.name} | Hylo</title>
        <meta name='description' content={TextHelpers.truncateHTML(group.description, MAX_DETAILS_LENGTH)} />
      </Helmet>

      <div className={g.groupDetailHeader} style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
        {!fullPage && (
          <a className={g.close} onClick={closeDetailModal}><Icon name='Ex' /></a>
        )}
        <div className={g.groupTitleContainer}>
          <img src={group.avatarUrl || DEFAULT_AVATAR} className={g.groupAvatar} />
          <div>
            <div className={g.groupTitle}>{isAboutCurrentGroup && <span>{t('About')}</span>} {group.name}</div>
            <div className={g.groupContextInfo}>
              <div>
                <span className={g.groupPrivacy}>
                  <Icon name={visibilityIcon(group.visibility)} className={g.privacyIcon} />
                  <div className={g.privacyTooltip}>
                    <div>{t(visibilityString(group.visibility))} - {t(visibilityDescription(group.visibility))}</div>
                  </div>
                </span>
                <span className={g.groupPrivacy}>
                  <Icon name={accessibilityIcon(group.accessibility)} className={g.privacyIcon} />
                  <div className={g.privacyTooltip}>
                    <div>{t(accessibilityString(group.accessibility))} - {t(accessibilityDescription(group.accessibility))}</div>
                  </div>
                </span>
                <span className={g.memberCount}>{group.memberCount} {group.memberCount > 1 ? t('Members') : t('Member')}</span>
              </div>
              <span className={g.groupLocation}>{group.location}</span>
            </div>
          </div>
        </div>
        <div className={g.headerBackground} />
      </div>

      <div className={g.groupDetailBody}>
        {group.type === GROUP_TYPES.default && defaultGroupBody({ group, isAboutCurrentGroup, t, responsibilityTitles })}
        {group.type === GROUP_TYPES.farm && (
          <FarmGroupDetailBody isMember={isMember} group={group} currentUser={currentUser} routeParams={routeParams} />
        )}
        {isAboutCurrentGroup || group.type === GROUP_TYPES.farm
          ? (
            <div className={g.aboutCurrentGroup}>
              <h3>{group.stewardDescriptorPlural || t('Stewards')}</h3>
              <div className={g.stewards}>
                {stewards.map(p => (
                  <Link to={personUrl(p.id, group.slug)} key={p.id} className={g.steward}>
                    <Avatar avatarUrl={p.avatarUrl} medium />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            )
          : ''
        }
        <div className={g.detailSection}>
          <h3>{t('Privacy settings')}</h3>
          <div className={g.privacySetting}>
            <Icon name={visibilityIcon(group.visibility)} className={g.settingIcon} />
            <p>{t(visibilityString(group.visibility))} - {t(visibilityDescription(group.visibility))}</p>
          </div>
          <div className={g.privacySetting}>
            <Icon name={accessibilityIcon(group.accessibility)} className={g.settingIcon} />
            <p>{t(accessibilityString(group.accessibility))} - {t(accessibilityDescription(group.accessibility))}</p>
          </div>
        </div>
        {group.agreements?.length > 0
          ? (
            <div className={cx(g.agreements, g.detailSection)}>
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
                <div className={g.signupButton}>
                  <Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} className={g.requestButton}>
                    {t('Signup or Login to connect with')}{' '}
                    <span className={g.requestGroup}>{group.name}</span>
                  </Link>
                </div>)
              : isMember
                ? (
                  <div className={g.existingMember}>
                    {t('You are a member of ')}
                    <Link to={groupUrl(group.slug)}>{group.name}</Link>
                  </div>)
                : (
                  <div>
                    <JoinSection
                      addSkill={addSkill}
                      currentUser={currentUser}
                      fullPage={fullPage}
                      group={group}
                      groupsWithPendingRequests={groupsWithPendingRequests}
                      joinGroup={joinGroupHandler}
                      requestToJoinGroup={requestToJoinGroup}
                      removeSkill={removeSkill}
                      routeParams={routeParams}
                      t={t}
                    />
                  </div>
                  )
          : ''
        }
      </div>
      <Tooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        id='join-tip'
      />
      <SocketSubscriber type='group' id={group.id} />
    </div>
  )
}

// GroupDetail.propTypes = {
//   group: PropTypes.object,
//   currentUser: PropTypes.object,
//   fetchGroup: PropTypes.func,
//   fetchJoinRequests: PropTypes.func,
//   joinGroup: PropTypes.func,
//   createJoinRequest: PropTypes.func
// }

const defaultGroupBody = ({ group, isAboutCurrentGroup, responsibilityTitles, t }) => {
  return (
    <>
      {isAboutCurrentGroup && group.aboutVideoUri && (
        <GroupAboutVideoEmbed uri={group.aboutVideoUri} className={g.groupAboutVideo} />
      )}
      {isAboutCurrentGroup && (!group.purpose && !group.description) && responsibilityTitles.includes(RESP_ADMINISTRATION)
        ? (
          <div className={g.noDescription}>
            <div>
              <h4>{t('Your group doesn\'t have a description')}</h4>
              <p>{t('Add a description, location, suggested topics and more in your group settings')}</p>
              <Link to={groupUrl(group.slug, 'settings')}>{t('Add a group description')}</Link>
            </div>
          </div>
          )
        : group.purpose || group.description
          ? (
            <div className={cx(g.groupDescription, g.detailSection)}>
              {group.purpose
                ? (
                  <>
                    <h3>{t('Purpose')}</h3>
                    <ClickCatcher>
                      <HyloHTML element='span' html={TextHelpers.markdown(group.purpose)} />
                    </ClickCatcher>
                  </>
                  )
                : ''}
              {group.description
                ? (
                  <>
                    <h3>{t('Description')}</h3>
                    <ClickCatcher>
                      <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
                    </ClickCatcher>
                  </>
                  )
                : ''}
            </div>
            )
          : ''
      }
    </>
  )
}

export function JoinSection ({ addSkill, currentUser, fullPage, group, groupsWithPendingRequests, joinGroup, requestToJoinGroup, removeSkill, routeParams, t }) {
  const hasPendingRequest = groupsWithPendingRequests[group.id]

  return (
    <div className={g.requestBar}>
      {group.suggestedSkills && group.suggestedSkills.length > 0 &&
        <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}
      {group.prerequisiteGroups && group.prerequisiteGroups.length > 0
        ? <div className={g.prerequisiteGroups}>
          {group.prerequisiteGroups.length === 1 ? <h4>{group.name}{' '}{t('is only accessible to members of')}{' '}{group.prerequisiteGroups.map(prereq => <span key={prereq.id}>{prereq.name}</span>)}</h4> : <h4>{t('{{group.name}} is only accessible to members of the following groups:', { group })}</h4>}
          {group.prerequisiteGroups.map(prereq => <div key={prereq.id} className={g.prerequisiteGroup}>
            <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} className={cx(g.groupDetailHeader, g.prereqHeader)} style={{ backgroundImage: `url(${prereq.bannerUrl || DEFAULT_BANNER})` }}>
              <div className={g.groupTitleContainer}>
                <img src={prereq.avatarUrl || DEFAULT_AVATAR} height='50px' width='50px' />
                <div>
                  <div className={g.groupTitle}>{prereq.name}</div>
                  <div className={g.groupContextInfo}>
                    <span className={g.groupPrivacy}>
                      <Icon name={visibilityIcon(prereq.visibility)} className={g.privacyIcon} />
                      <div className={g.privacyTooltip}>
                        <div>{t(visibilityString(prereq.visibility))} - {t(visibilityDescription(prereq.visibility))}</div>
                      </div>
                    </span>
                    <span className={g.groupPrivacy}>
                      <Icon name={accessibilityIcon(prereq.accessibility)} className={g.privacyIcon} />
                      <div className={g.privacyTooltip}>
                        <div>{t(accessibilityString(prereq.accessibility))} - {t(accessibilityDescription(prereq.accessibility))}</div>
                      </div>
                    </span>
                    {prereq.location}
                  </div>
                </div>
              </div>
              <div className={g.headerBackground} />
            </Link>
            <div className={g.cta}>
              {t('To join')}{' '}{group.name} <Link to={fullPage ? groupUrl(prereq.slug) : groupDetailUrl(prereq.slug, routeParams)} className={g.prereqVisitLink}>{t('visit')} {prereq.name}</Link>{' '}{t('and become a member')}
            </div>
          </div>)}
        </div>
        : group.numPrerequisitesLeft
          ? t('This group has prerequisite groups you cannot see, you cannot join this group at this time')
          : group.accessibility === GROUP_ACCESSIBILITY.Open
            ? <JoinQuestionsAndButtons group={group} joinGroup={joinGroup} joinText={t('Join {{group.name}}', { group })} t={t} />
            : group.accessibility === GROUP_ACCESSIBILITY.Restricted
              ? hasPendingRequest
                ? <div className={g.requestPending}>{t('Request to join pending')}</div>
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
    <div className={g.joinQuestion}>
      <h4>{t('Which of the following skills & interests are relevant to you?')}</h4>
      <div className={g.skillPills}>
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
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(!group.settings.askJoinQuestions || questionAnswers.length === 0)

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
    <div className={g.requestOption}>
      {group.settings.askJoinQuestions && questionAnswers.length > 0 && <div>{t('Please answer the following to join')}:</div>}
      {group.settings.askJoinQuestions && questionAnswers.map((q, index) => (
        <div className={g.joinQuestion} key={index}>
          <h3>{q.text}</h3>
          <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={t('Type your answer here...')} />
        </div>
      )
      )}
      <div className={g.center}>
        <div
          className={cx(g.requestButton, { [g.disabledButton]: !allQuestionsAnswered })}
          onClick={allQuestionsAnswered ? () => joinGroup(group.id, questionAnswers) : () => {}}
          data-tooltip-content={!allQuestionsAnswered ? t('You must answer all the questions to join') : ''}
          data-tooltip-id='join-tip'
        >
          {joinText}
        </div>
      </div>
    </div>
  )
}

export default GroupDetail
