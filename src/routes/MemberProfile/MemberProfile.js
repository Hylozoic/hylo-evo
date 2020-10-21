import React from 'react'
import { filter, isFunction } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'
import { firstName as getFirstName, AXOLOTL_ID } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import {
  currentUserSettingsUrl,
  messageThreadUrl,
  messagesUrl,
  gotoExternalUrl
} from 'util/navigation'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import Loading from 'components/Loading'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'
import MemberComments from './MemberComments'
import MemberVotes from './MemberVotes'
import SkillsSection from 'components/SkillsSection'
import './MemberProfile.scss'

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
    if (this.props.error) return <Error>this.props.error</Error>
    if (this.props.personLoading) return <Loading />

    const {
      contentLoading,
      person,
      currentUser,
      routeParams,
      push
    } = this.props
    const { currentTab } = this.state
    const personId = routeParams.personId
    const firstName = getFirstName(person)
    const locationWithoutUsa = person.location && person.location.replace(', United States', '')
    const isCurrentUser = currentUser && currentUser.id === personId
    const isAxolotl = AXOLOTL_ID === personId
    const actionMenuItems = [
      { icon: 'Edit', label: 'Edit Profile', onClick: () => push(currentUserSettingsUrl()), hide: !isCurrentUser },
      { icon: 'Ex', label: 'Block this Member', onClick: () => this.blockUser(personId), hide: isCurrentUser || isAxolotl }
    ]
    const contentDropDownItems = [
      { label: 'Overview', title: `${firstName}'s recent activity`, component: RecentActivity },
      { label: 'Posts', title: `${firstName}'s posts`, component: MemberPosts },
      { label: 'Comments', title: `${firstName}'s comments`, component: MemberComments },
      { label: 'Upvotes', title: `${firstName}'s upvotes`, component: MemberVotes }
    ].map(contentDropDownitem => ({
      ...contentDropDownitem, onClick: () => this.selectTab(contentDropDownitem.label)
    }))
    const currentContent = contentDropDownItems.find(contentItem => contentItem.label === currentTab)
    const CurrentContentComponent = currentContent.component

    return <div styleName='member-profile'>
      <ReactTooltip
        place='bottom'
        type='light'
        effect='solid'
        clickable
        delayHide={10000}
        delayShow={500}
        getContent={content => <ActionTooltip content={content} />} />
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
          {/* TODO: Do we still want to show the "Community manager" role? */}
          {/* {role && <div styleName='location'>
            <Icon styleName='star' name='StarCircle' />
            {role}
          </div>} */}
        </div>
        <div styleName='action-icons'>
          <Icon
            styleName='action-icon-button'
            name='Letter'
            onClick={() => push(isCurrentUser ? messagesUrl() : messageThreadUrl(person))} />
          {person.contactPhone && <Icon
            styleName='action-icon-button'
            name='Phone'
            dataTip={person.contactPhone}
            onClick={() => handleContactPhone(person.contactPhone)} />}
          {person.contactEmail && <Icon
            styleName='action-icon-button'
            name='Email'
            dataTip={person.contactEmail}
            onClick={() => handleContactEmail(person.contactEmail)} />}
          {person.facebookUrl && <Icon
            styleName='action-icon-button'
            name='Facebook'
            dataTip={person.facebookUrl}
            onClick={() => gotoExternalUrl(person.facebookUrl)} />}
          {person.linkedinUrl && <Icon
            styleName='action-icon-button'
            name='LinkedIn'
            dataTip={person.linkedinUrl}
            onClick={() => gotoExternalUrl(person.linkedinUrl)} />}
          {person.twitterName && <Icon
            styleName='action-icon-button'
            name='Twitter'
            dataTip={`https://twitter.com/${person.twitterName}`}
            onClick={() => gotoExternalUrl(`https://twitter.com/${person.twitterName}`)} />}
          {person.url && <Icon
            styleName='action-icon-button'
            name='Public'
            onClick={() => gotoExternalUrl(person.url)} />}
          <MemberActionsMenu items={actionMenuItems} />
        </div>
        {person.tagline && <div styleName='tagline'>{person.tagline}</div>}
        {person.bio && <div styleName='bio'>{person.bio}</div>}
        <div styleName='member-details'>
          <div styleName='profile-subhead'>
            Skills &amp; Interests
          </div>
          <SkillsSection personId={personId} editable={false} />
        </div>
      </div>
      <div styleName='content'>
        <div styleName='content-controls'>
          <h2 styleName='content-header'>{currentContent.title}</h2>
          <Dropdown
            styleName='content-dropdown'
            items={contentDropDownItems}
            toggleChildren={<span>{currentTab} <Icon styleName='content-dropdown-icon' name='ArrowDown' /></span>}
          />
        </div>
        <CurrentContentComponent routeParams={routeParams} loading={contentLoading} />
      </div>
    </div>
  }
}

export function ActionTooltip ({ content }) {
  return <div styleName='action-icon-tooltip'>
    {content}
    <CopyToClipboard text={content}>
      <Button styleName='action-icon-tooltip-button'><Icon name='Edit' /> Copy</Button>
    </CopyToClipboard>
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

export function MemberActionsMenu ({ items }) {
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

export function Error ({ children }) {
  return <div styleName='member-profile'>
    <span styleName='error'>{children}</span>
  </div>
}
