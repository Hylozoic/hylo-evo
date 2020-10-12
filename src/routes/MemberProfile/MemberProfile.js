import React from 'react'
import { filter, isFunction } from 'lodash'
import { firstName as getFirstName } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import { messageThreadUrl, messagesUrl } from 'util/navigation'
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

  blockUser = (personId) => () => {
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
    // TODO: Re-introduce Block this Member and Profile setting action dropdown
    const isCurrentUser = currentUser && currentUser.id === personId
    // const isAxolotl = AXOLOTL_ID === personId
    // const actionMenuItems = [
    //   { icon: 'Ex', label: 'Block this Member', onClick: this.blockUser(personId), hide: isCurrentUser || isAxolotl }
    // ]
    const contentMap = [
      { label: 'Overview', title: `${firstName}'s recent activity`, component: RecentActivity },
      { label: 'Posts', title: `${firstName}'s posts`, component: MemberPosts },
      { label: 'Comments', title: `${firstName}'s comments`, component: MemberComments },
      { label: 'Upvotes', title: `${firstName}'s upvotes`, component: MemberVotes }
    ]
    const contentDropDownItems = contentMap.map(({ label }) => ({
      label, onClick: () => this.selectTab(label)
    }))
    const currentContent = contentMap.find(contentItem => contentItem.label === currentTab)
    const CurrentContentComponent = currentContent.component

    return <div styleName='member-profile'>
      <div styleName='header'>
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
          <Icon styleName='action-icon-button' name='Letter' onClick={() => push(isCurrentUser ? messagesUrl() : messageThreadUrl(person))} />
          {/* TODO: Edit Profile and Block user menu ? */}
          {/* <Icon name='Ellipses' styleName='action-icon-button' onClick={() => gotoExternalUrl(person.facebookUrl)} /> */}
          {/* <MemberActionsMenu items={actionMenuItems} /> */}
          {person.contactPhone &&
            <Icon styleName='action-icon-button' name='Phone' onClick={() => gotoExternalUrl(`tel:${person.contactPhone}`)} />}
          {person.contactEmail &&
            <Icon styleName='action-icon-button' name='Email' onClick={() => gotoExternalUrl(`email:${person.contactEmail}`)} />}
          {person.facebookUrl &&
            <Icon styleName='action-icon-button' name='Facebook' onClick={() => gotoExternalUrl(person.facebookUrl)} />}
          {person.linkedinUrl &&
            <Icon styleName='action-icon-button' name='LinkedIn' onClick={() => gotoExternalUrl(person.linkedinUrl)} />}
          {person.twitterName &&
            <Icon styleName='action-icon-button' name='Twitter' onClick={() => gotoExternalUrl(`https://twitter.com/${person.twitterName}`)} />}
          {person.url &&
            <Icon styleName='action-icon-button' name='Public' onClick={() => gotoExternalUrl(person.url)} />}
        </div>
        <div styleName='tagline'>{person.bio || person.tagline}</div>
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

const gotoExternalUrl = url => window.open(url, null, 'noopener,noreferrer')

const BLOCK_CONFIRM_MESSAGE = `Are you sure you want to block this member?
You will no longer see this member's activity
and they won't see yours.

You can unblock this member at any time.
Go to Settings > Blocked Users.`

export function MemberActionsMenu ({ items }) {
  const activeItems = filter(items, item =>
    isFunction(item.onClick) && !item.hide)

  return activeItems.length > 0 &&
    <Dropdown items={activeItems} toggleChildren={<Icon name='More' />} />
}

export function Error ({ children }) {
  return <div styleName='member-profile'>
    <span styleName='error'>{children}</span>
  </div>
}
