import React, { useState } from 'react'
import { filter, isFunction } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import Moment from 'moment'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import { twitterUrl, AXOLOTL_ID } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import {
  currentUserSettingsUrl,
  messagePersonUrl,
  messagesUrl,
  gotoExternalUrl
} from 'util/navigation'
import Affiliation from 'components/Affiliation'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import RoundImageRow from 'components/RoundImageRow'
import Loading from 'components/Loading'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'
import MemberComments from './MemberComments'
import Membership from 'components/Membership'
import MemberVotes from './MemberVotes'
import SkillsSection from 'components/SkillsSection'
import SkillsToLearnSection from 'components/SkillsToLearnSection'
import styles from './MemberProfile.scss'

export default class MemberProfile extends React.Component {
  static defaultProps = {
    currentTab: 'Overview'
  }

  constructor (props) {
    super(props)
    this.state = {
      currentTab: props.currentTab
    }
  }

  componentDidMount () {
    const { personId } = this.props.routeParams
    if (personId) this.props.fetchPerson(personId)
  }

  selectTab = currentTab => this.setState({ currentTab })

  blockUser = personId => {
    if (window.confirm(BLOCK_CONFIRM_MESSAGE)) {
      this.props.blockUser(personId).then(this.props.goToPreviousLocation)
    }
  }

  render () {
    if (this.props.error) return <Error>{this.props.error}</Error>
    if (this.props.personLoading) return <Loading />

    const {
      contentLoading,
      person,
      currentUser,
      routeParams,
      showDetails,
      push
    } = this.props
    const affiliations = person.affiliations && person.affiliations.items
    const events = person.eventsAttending && person.eventsAttending.items
    const memberships = person.memberships
    const projects = person.projects && person.projects.items
    const { currentTab } = this.state
    const personId = routeParams.personId
    const locationWithoutUsa = person.location && person.location.replace(', United States', '')
    const isCurrentUser = currentUser && currentUser.id === personId
    const isAxolotl = AXOLOTL_ID === personId
    const contentDropDownItems = [
      { label: 'Overview', title: `${person.name}'s recent activity`, component: RecentActivity },
      { label: 'Posts', title: `${person.name}'s posts`, component: MemberPosts },
      { label: 'Comments', title: `${person.name}'s comments`, component: MemberComments },
      { label: 'Upvotes', title: `${person.name}'s upvotes`, component: MemberVotes }
    ].map(contentDropDownitem => ({
      ...contentDropDownitem, onClick: () => this.selectTab(contentDropDownitem.label)
    }))
    const actionButtonsItems = [
      { iconName: 'Letter', value: 'Message Member', onClick: () => push(isCurrentUser ? messagesUrl() : messagePersonUrl(person)), hideTooltip: true },
      { iconName: 'Phone', value: person.contactPhone, onClick: () => handleContactPhone(person.contactPhone) },
      { iconName: 'Email', value: person.contactEmail, onClick: () => handleContactEmail(person.contactEmail) },
      { iconName: 'Facebook', value: person.facebookUrl, onClick: () => gotoExternalUrl(person.facebookUrl) },
      { iconName: 'LinkedIn', value: person.linkedinUrl, onClick: () => gotoExternalUrl(person.linkedinUrl) },
      { iconName: 'Twitter', value: twitterUrl(person.twitterName), onClick: () => gotoExternalUrl(twitterUrl(person.twitterName)) },
      { iconName: 'Public', value: person.url, onClick: () => gotoExternalUrl(person.url) }
    ]
    const actionDropdownItems = [
      { icon: 'Edit', label: 'Edit Profile', onClick: () => push(currentUserSettingsUrl()), hide: !isCurrentUser },
      { icon: 'Ex', label: 'Block this Member', onClick: () => this.blockUser(personId), hide: isCurrentUser || isAxolotl }
    ]
    const {
      title: currentContentTitle,
      component: CurrentContentComponent
    } = contentDropDownItems.find(contentItem => contentItem.label === currentTab)

    return <div styleName='member-profile'>
      <div styleName='header'>
        {isCurrentUser && <Button styleName='edit-profile-button' onClick={() => push(currentUserSettingsUrl())}>
          <Icon name='Edit' /> Edit Profile
        </Button>}
        <div styleName='header-banner' style={bgImageStyle(person.bannerUrl)}>
          <RoundImage styleName='header-member-avatar' url={person.avatarUrl} xlarge />
          <h1 styleName='header-member-name'>{person.name}</h1>
          {person.location && <div styleName='header-member-location'>
            <Icon name='Location' styleName='header-member-location-icon' />
            {locationWithoutUsa}
          </div>}
          {/* TODO: Do we still want to show the "Group manager" role? */}
          {/* {role && <div styleName='location'>
            <Icon styleName='star' name='StarCircle' />
            {role}
          </div>} */}
        </div>
        <div styleName='action-icons'>
          <ActionButtons items={actionButtonsItems} />
          <ActionDropdown items={actionDropdownItems} />
        </div>
        {person.tagline && <div styleName='tagline'>{person.tagline}</div>}
        {person.bio && <div styleName='bio'>{person.bio}</div>}
        <div styleName='member-details'>
          <div styleName='profile-subhead'>
            Skills &amp; Interests
          </div>
          <SkillsSection personId={personId} editable={false} />
          <div styleName='profile-subhead'>
            What I&apos;m Learning
          </div>
          <SkillsToLearnSection personId={personId} editable={false} />

          { memberships && memberships.length > 0 && <div styleName='profile-subhead'>Hylo Communities</div> }
          { memberships && memberships.length > 0 && memberships.map((m, index) => <Membership key={m.id} index={index} membership={m} />) }

          { affiliations && affiliations.length > 0 && <div styleName='profile-subhead'>Other Affiliations</div> }
          { affiliations && affiliations.length > 0 && affiliations.map((a, index) => <Affiliation key={a.id} index={index} affiliation={a} />) }

          {events && events.length > 0 && <div styleName='profile-subhead'>Upcoming Events</div>}
          {events && events.length > 0 && events.map((e, index) => <Event key={index} memberCap={3} event={e} routeParams={routeParams} showDetails={showDetails} />)}

          {projects && projects.length > 0 && <div styleName='profile-subhead'>Projects</div>}
          {projects && projects.length > 0 && projects.map((p, index) => <Project key={index} memberCap={3} project={p} routeParams={routeParams} showDetails={showDetails} />)}
        </div>
      </div>
      <div styleName='content'>
        <div styleName='content-controls'>
          <h2 styleName='content-header'>{currentContentTitle}</h2>
          <Dropdown
            styleName='content-dropdown'
            items={contentDropDownItems}
            toggleChildren={
              <span>{currentTab} <Icon styleName='content-dropdown-icon' name='ArrowDown' /></span>} />
        </div>
        <CurrentContentComponent routeParams={routeParams} loading={contentLoading} />
      </div>
    </div>
  }
}

export function ActionTooltip ({ content, onClick }) {
  const [copied, setCopied] = useState(false)

  return <div styleName='action-icon-tooltip'>
    <span styleName='action-icon-tooltip-content' onClick={onClick}>
      {content}
    </span>
    <CopyToClipboard text={content} onCopy={() => setCopied(true)}>
      <Button styleName={cx('action-icon-tooltip-button', { copied })}>
        <Icon name='Copy' />
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </CopyToClipboard>
  </div>
}

export function ActionButtons ({ items }) {
  return items.map((actionIconItem, index) => {
    const { iconName, value, onClick, hideTooltip } = actionIconItem

    if (!value) return null

    const tooltipId = `tooltip-${index}`
    const tooltipProps = hideTooltip
      ? {}
      : {
        dataTip: value,
        dataTipFor: tooltipId
      }

    return <React.Fragment key={index}>
      <Icon
        key={index}
        styleName='action-icon-button'
        name={iconName}
        onClick={onClick}
        {...tooltipProps} />
      {!hideTooltip && <ReactTooltip
        id={tooltipId}
        place='bottom'
        type='light'
        effect='solid'
        clickable
        delayHide={500}
        delayShow={500}
        afterShow={e => {
          const hoverClassName = styles['action-icon-button-hover']
          const elements = document.getElementsByClassName(hoverClassName)
          while (elements.length > 0) {
            elements[0].classList.remove(hoverClassName)
          }
          e.target.classList.add(hoverClassName)
        }}
        afterHide={e => {
          const hoverClassName = styles['action-icon-button-hover']
          const elements = document.getElementsByClassName(hoverClassName)
          while (elements.length > 0) {
            elements[0].classList.remove(hoverClassName)
          }
          e.target.classList.remove(hoverClassName)
        }}
        getContent={() =>
          <ActionTooltip content={value} onClick={onClick} key={index} />}
      />}
    </React.Fragment>
  })
}

export function ActionDropdown ({ items }) {
  const activeItems = filter(items, item =>
    isFunction(item.onClick) && !item.hide)

  return activeItems.length > 0 &&
    <Dropdown
      items={activeItems}
      toggleChildren={
        <Icon styleName='action-icon-button action-menu' name='More' />
      }
    />
}

export function Project ({ memberCap, project, routeParams, showDetails }) {
  const { title, id, createdAt, creator, members } = project
  return (
    <div styleName='project' onClick={() => showDetails(id, { ...routeParams })}>
      <div>
        <div styleName='title'>{title} </div>
        <div styleName='meta'>{creator.name} - {Moment(createdAt).fromNow()} </div>
      </div>
      <RoundImageRow styleName={`members${members.items.length > memberCap ? '-plus' : ''}`} inline imageUrls={members.items.map(m => m.avatarUrl)} cap={memberCap} />
    </div>
  )
}

export function Event ({ memberCap, event, routeParams, showDetails }) {
  const { id, location, eventInvitations, startTime, title } = event
  return (
    <div styleName='event' onClick={() => showDetails(id, { ...routeParams })}>
      <div styleName='date'>
        <div styleName='month'>{Moment(startTime).format('MMM')}</div>
        <div styleName='day'>{Moment(startTime).format('DD')}</div>
      </div>
      <div styleName='details'>
        <div styleName='title'>{title}</div>
        <div styleName='meta'><Icon name='Location' />{location}</div>
      </div>
      <RoundImageRow styleName={`members${eventInvitations.items.length > memberCap ? '-plus' : ''}`} inline imageUrls={eventInvitations.items.map(e => e.person.avatarUrl)} cap={memberCap} />
    </div>
  )
}

export function Error ({ children }) {
  return <div styleName='member-profile'>
    <span styleName='error'>{children}</span>
  </div>
}

export function handleContactPhone (contactPhone) {
  return window.location.assign(`tel:${contactPhone}`)
}

export function handleContactEmail (contactEmail) {
  return window.location.assign(`mailto:${contactEmail}`)
}

const BLOCK_CONFIRM_MESSAGE = `Are you sure you want to block this member?
You will no longer see this member's activity
and they won't see yours.

You can unblock this member at any time.
Go to Settings > Blocked Users.`
