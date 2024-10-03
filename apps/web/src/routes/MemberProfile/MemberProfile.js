import cx from 'classnames'
import { filter, isFunction } from 'lodash'
import Moment from 'moment-timezone'
import React, { useState, useEffect, useRef } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Tooltip } from 'react-tooltip'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import { TextHelpers } from 'hylo-shared'
import { twitterUrl, AXOLOTL_ID } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import {
  currentUserSettingsUrl,
  messagePersonUrl,
  messagesUrl,
  gotoExternalUrl,
  postUrl
} from 'util/navigation'
import Affiliation from 'components/Affiliation'
import Button from 'components/Button'
import BadgeEmoji from 'components/BadgeEmoji'
import ClickCatcher from 'components/ClickCatcher'
import Dropdown from 'components/Dropdown'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import NotFound from 'components/NotFound'
import RoundImage from 'components/RoundImage'
import RoundImageRow from 'components/RoundImageRow'
import Loading from 'components/Loading'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'
import MemberComments from './MemberComments'
import Membership from 'components/Membership'
import MemberVotes from './MemberVotes' // TODO REACTIONS: switch this to reactions
import SkillsSection from 'components/SkillsSection'
import SkillsToLearnSection from 'components/SkillsToLearnSection'

import styles from './MemberProfile.module.scss'

import { useSelector, useDispatch } from 'react-redux'
import blockUser from 'store/actions/blockUser'
import getRolesForGroup from 'store/selectors/getRolesForGroup'
import isPendingFor from 'store/selectors/isPendingFor'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import fetchPerson from 'store/actions/fetchPerson'
import {
  FETCH_RECENT_ACTIVITY,
  FETCH_MEMBER_POSTS,
  FETCH_MEMBER_COMMENTS,
  FETCH_MEMBER_VOTES, // TODO REACTIONS: switch this to reactions
  getPresentedPerson
} from './MemberProfile.store'
import getGroupForSlug from 'store/selectors/getGroupForSlug'

const GROUPS_DIV_HEIGHT = 200

const MESSAGES = {
  invalid: "That doesn't seem to be a valid person ID."
}

const MemberProfile = ({ currentTab = 'Overview', blockConfirmMessage, isSingleColumn, t }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()

  const personId = routeParams.personId
  const error = !Number.isSafeInteger(Number(personId)) ? MESSAGES.invalid : null
  const person = useSelector(state => getPresentedPerson(state, routeParams))
  const contentLoading = useSelector(state => isPendingFor([
    FETCH_RECENT_ACTIVITY,
    FETCH_MEMBER_POSTS,
    FETCH_MEMBER_COMMENTS,
    FETCH_MEMBER_VOTES
  ], state))
  const personLoading = useSelector(state => isPendingFor(fetchPerson, state))
  const groupSlug = routeParams.groupSlug
  const group = groupSlug ? useSelector(state => getGroupForSlug(state, groupSlug)) : null
  const roles = useSelector(state => getRolesForGroup(state, { person, groupId: group?.id }))
  const currentUser = useSelector(getMe)
  const previousLocation = useSelector(getPreviousLocation)

  const fetchPersonAction = (id) => dispatch(fetchPerson(id))
  const blockUserAction = (id) => dispatch(blockUser(id))
  const push = (url) => navigate(url)
  const showDetails = (id, params) => navigate(postUrl(id, params))
  const goToPreviousLocation = () => navigate(previousLocation)

  const [currentTabState, setCurrentTabState] = useState(currentTab)
  const [showAllGroups, setShowAllGroups] = useState(false)
  const [showExpandGroupsButton, setShowExpandGroupsButton] = useState(false)
  const groupsRef = useRef(null)

  useEffect(() => {
    if (personId) fetchPersonAction(personId)
    checkGroupsHeight()
  }, [])

  useEffect(() => {
    checkGroupsHeight()
  })

  const checkGroupsHeight = () => {
    if (groupsRef.current && groupsRef.current.scrollHeight > GROUPS_DIV_HEIGHT && !showExpandGroupsButton) {
      setShowExpandGroupsButton(true)
    }
  }

  const selectTab = tab => setCurrentTabState(tab)

  const handleBlockUser = personId => {
    if (window.confirm(blockConfirmMessage)) {
      blockUserAction(personId).then(goToPreviousLocation)
    }
  }

  const toggleShowAllGroups = () => {
    setShowAllGroups(!showAllGroups)
  }

  if (error) return <Error>{error}</Error>
  if (personLoading) return <Loading />
  if (!person?.name) return <NotFound />

  const affiliations = person.affiliations && person.affiliations.items
  const events = person.eventsAttending && person.eventsAttending.items
  const memberships = person.memberships.sort((a, b) => a.group.name.localeCompare(b.group.name))
  const projects = person.projects && person.projects.items
  const locationWithoutUsa = person.location && person.location.replace(', United States', '')
  const isCurrentUser = currentUser && currentUser.id === personId
  const isAxolotl = AXOLOTL_ID === personId
  const contentDropDownItems = [
    { id: 'Overview', label: t('Overview'), title: t('{{name}}s recent activity', { name: person.name }), component: RecentActivity },
    { id: 'Posts', label: t('Posts'), title: t('{{name}}s posts', { name: person.name }), component: MemberPosts },
    { id: 'Comments', label: t('Comments'), title: t('{{name}}s comments', { name: person.name }), component: MemberComments },
    { id: 'Reactions', label: t('Reactions'), title: t('{{name}}s reactions', { name: person.name }), component: MemberVotes } // TODO REACTIONS: switch this to reactions
  ].map(contentDropDownitem => ({
    ...contentDropDownitem, onClick: () => selectTab(contentDropDownitem.label)
  }))
  const actionButtonsItems = [
    { iconName: 'Messages', value: t('Message Member'), onClick: () => push(isCurrentUser ? messagesUrl() : messagePersonUrl(person)), hideCopyTip: true },
    { iconName: 'Phone', value: person.contactPhone, onClick: () => handleContactPhone(person.contactPhone) },
    { iconName: 'Email', value: person.contactEmail, onClick: () => handleContactEmail(person.contactEmail) },
    { iconName: 'Facebook', value: person.facebookUrl, onClick: () => gotoExternalUrl(person.facebookUrl) },
    { iconName: 'LinkedIn', value: person.linkedinUrl, onClick: () => gotoExternalUrl(person.linkedinUrl) },
    { iconName: 'Twitter', value: twitterUrl(person.twitterName), onClick: () => gotoExternalUrl(twitterUrl(person.twitterName)) },
    { iconName: 'Public', value: person.url, onClick: () => gotoExternalUrl(person.url) }
  ]
  const actionDropdownItems = [
    { icon: 'Edit', label: t('Edit Profile'), onClick: () => push(currentUserSettingsUrl()), hide: !isCurrentUser },
    { icon: 'Ex', label: t('Block this Member'), onClick: () => handleBlockUser(personId), hide: isCurrentUser || isAxolotl }
  ]
  const {
    title: currentContentTitle,
    component: CurrentContentComponent
  } = contentDropDownItems.find(contentItem => contentItem.id === currentTabState)

  return (
    <div className={cx(styles.memberProfile, { [styles.isSingleColumn]: isSingleColumn })}>
      <Helmet>
        <title>{person.name} | Hylo</title>
        <meta name='description' content={`${person.name}: ${t('Member Profile')}`} />
      </Helmet>
      <div className={styles.header}>
        {isCurrentUser &&
          <Button className={styles.editProfileButton} onClick={() => push(currentUserSettingsUrl())}>
            <Icon name='Edit' /> {t('Edit Profile')}
          </Button>}
        <div className={styles.headerBanner} style={bgImageStyle(person.bannerUrl)}>
          <RoundImage className={styles.headerMemberAvatar} url={person.avatarUrl} xlarge />
          <h1 className={styles.headerMemberName}>{person.name}</h1>
          <div className={styles.badgeRow}>
            {roles.map(role => (
              <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={person.id} />
            ))}
          </div>
          {person.location && <div className={styles.headerMemberLocation}>
            <Icon name='Location' className={styles.headerMemberLocationIcon} />
            {locationWithoutUsa}
          </div>}
        </div>
        <div className={styles.actionIcons}>
          <ActionButtons items={actionButtonsItems} />
          <ActionDropdown items={actionDropdownItems} />
        </div>
        {person.tagline && <div className={styles.tagline}>{person.tagline}</div>}
        {person.bio && <div className={styles.bio}>
          <ClickCatcher>
            <HyloHTML element='span' html={TextHelpers.markdown(person.bio)} />
          </ClickCatcher>
        </div>}
        <div className={styles.memberDetails}>
          <div className={styles.profileSubhead}>
            {t('Skills & Interests')}
          </div>
          <SkillsSection personId={personId} editable={false} />
          <div className={styles.profileSubhead}>
            {t('What I\'m Learning')}
          </div>
          <SkillsToLearnSection personId={personId} editable={false} />

          {memberships && memberships.length > 0 && <div className={styles.profileSubhead}>{t('Hylo Groups')}</div>}
          <div
            ref={groupsRef}
            className={styles.groups}
            style={{
              maxHeight: showAllGroups ? 'none' : `${GROUPS_DIV_HEIGHT}px`
            }}
          >
            {memberships && memberships.length > 0 && memberships.map((m, index) => <Membership key={m.id} index={index} membership={m} />)}
          </div>
          {showExpandGroupsButton && (
            <button onClick={toggleShowAllGroups} className={styles.showMoreButton}>
              {showAllGroups ? 'Show Less' : 'Show More'}
            </button>
          )}

          {affiliations && affiliations.length > 0 && <div className={styles.profileSubhead}>{t('Other Affiliations')}</div>}
          {affiliations && affiliations.length > 0 && affiliations.map((a, index) => <Affiliation key={a.id} index={index} affiliation={a} />)}

          {events && events.length > 0 && <div className={styles.profileSubhead}>{t('Upcoming Events')}</div>}
          {events && events.length > 0 && events.map((e, index) => <Event key={index} memberCap={3} event={e} routeParams={routeParams} showDetails={showDetails} />)}

          {projects && projects.length > 0 && <div className={styles.profileSubhead}>{t('Projects')}</div>}
          {projects && projects.length > 0 && projects.map((p, index) => <Project key={index} memberCap={3} project={p} routeParams={routeParams} showDetails={showDetails} />)}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentControls}>
          <h2 className={styles.contentHeader}>{currentContentTitle}</h2>
          <Dropdown
            className={styles.contentDropdown}
            items={contentDropDownItems}
            toggleChildren={
              <span>{currentTabState} <Icon className={styles.contentDropdownIcon} name='ArrowDown' /></span>}
          />
        </div>
        <CurrentContentComponent routeParams={routeParams} loading={contentLoading} />
      </div>
    </div>
  )
}

export function ActionTooltip ({ content, hideCopyTip, onClick }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  return (
    <div className={styles.actionIconTooltip}>
      <span className={styles.actionIconTooltipContent} onClick={onClick}>
        {content}
      </span>
      {!hideCopyTip && <CopyToClipboard text={content} onCopy={() => setCopied(true)}>
        <Button className={cx(styles.actionIconTooltipButton, { [styles.copied]: copied })}>
          <Icon name='Copy' />
          {copied ? t('Copied!') : t('Copy')}
        </Button>
      </CopyToClipboard>}
    </div>
  )
}

export function ActionButtons ({ items }) {
  return items.map((actionIconItem, index) => {
    const { iconName, value, onClick, hideCopyTip } = actionIconItem

    if (!value) return null

    const tooltipId = `tooltip-${index}`
    const tooltipProps = {
      tooltipContent: value,
      tooltipId
    }

    return (
      <React.Fragment key={index}>
        <Icon
          key={index}
          className={styles.actionIconButton}
          name={iconName}
          onClick={onClick}
          {...tooltipProps} />
        <Tooltip
          id={tooltipId}
          place='bottom'
          type='light'
          effect='solid'
          clickable
          delayHide={500}
          delayShow={500}
          className={styles.tooltip}
          afterShow={e => {
            const hoverClassName = styles.actionIconButtonHover
            const elements = document.getElementsByClassName(hoverClassName)
            while (elements.length > 0) {
              elements[0].classList.remove(hoverClassName)
            }
            e.target.classList.add(hoverClassName)
          }}
          afterHide={e => {
            const hoverClassName = styles.actionIconButtonHover
            const elements = document.getElementsByClassName(hoverClassName)
            while (elements.length > 0) {
              elements[0].classList.remove(hoverClassName)
            }
            e.target.classList.remove(hoverClassName)
          }}
          content={() =>
            <ActionTooltip content={value} onClick={onClick} key={index} hideCopyTip={hideCopyTip} />}
        />
      </React.Fragment>
    )
  })
}

export function ActionDropdown ({ items }) {
  const activeItems = filter(items, item =>
    isFunction(item.onClick) && !item.hide)

  return activeItems.length > 0 &&
    <Dropdown
      alignRight
      items={activeItems}
      toggleChildren={
        <Icon className={cx(styles.actionIconButton, styles.actionMenu)} name='More' />
      }
    />
}

export function Project ({ memberCap, project, routeParams, showDetails }) {
  const { title, id, createdAt, creator, members } = project
  return (
    <div className={styles.project} onClick={() => showDetails(id, { ...routeParams })}>
      <div>
        <div className={styles.title}>{title} </div>
        <div className={styles.meta}>{creator.name} - {Moment(createdAt).fromNow()} </div>
      </div>
      <RoundImageRow className={cx(styles.members, { [styles.membersPlus]: members.items.length > memberCap })} inline imageUrls={members.items.map(m => m.avatarUrl)} cap={memberCap} />
    </div>
  )
}

export function Event ({ memberCap, event, routeParams, showDetails }) {
  const { id, location, eventInvitations, startTime, title } = event
  return (
    <div className={styles.event} onClick={() => showDetails(id, { ...routeParams })}>
      <div className={styles.date}>
        <div className={styles.month}>{Moment(startTime).format('MMM')}</div>
        <div className={styles.day}>{Moment(startTime).format('DD')}</div>
      </div>
      <div className={styles.details}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}><Icon name='Location' />{location}</div>
      </div>
      <RoundImageRow className={cx(styles.members, { [styles.membersPlus]: eventInvitations.items.length > memberCap })} inline imageUrls={eventInvitations.items.map(e => e.person.avatarUrl)} cap={memberCap} />
    </div>
  )
}

export function Error ({ children }) {
  return (
    <div className={styles.memberProfile}>
      <span className={styles.error}>{children}</span>
    </div>
  )
}

export function handleContactPhone (contactPhone) {
  return window.location.assign(`tel:${contactPhone}`)
}

export function handleContactEmail (contactEmail) {
  return window.location.assign(`mailto:${contactEmail}`)
}

export default withTranslation()(MemberProfile)
