import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
import { filter, isFunction } from 'lodash'
import { AXOLOTL_ID } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import './MemberProfile.scss'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import Loading from 'components/Loading'
import SimpleTabBar from 'components/SimpleTabBar'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'
import MemberComments from './MemberComments'
import MemberVotes from './MemberVotes'

const { any, arrayOf, object, string, shape } = PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    currentTab: string,
    error: any,
    person: shape({
      id: any,
      avatarUrl: string,
      bannerUrl: string,
      bio: string,
      facebookUrl: string,
      linkedinUrl: string,
      tagline: string,
      memberships: arrayOf(object),
      skills: arrayOf(object),
      name: string,
      role: string,
      twitterName: string,
      url: string
    })
  }

  componentDidMount () {
    const id = get('match.params.id', this.props)
    if (id) this.props.fetchPerson(id)
  }

  constructor (props) {
    super(props)
    this.state = {
      currentTab: props.currentTab
    }
  }

  selectTab = tab => this.setState({ currentTab: tab })

  displayError (error) {
    return <div styleName='member-profile'>
      <span styleName='error'>{ error }</span>
    </div>
  }

  blockUser = (memberId) => () => {
    const { blockUser, goToPreviousLocation } = this.props

    if (window.confirm(blockConfirmMessage)) blockUser(memberId).then(goToPreviousLocation)
  }

  render () {
    if (this.props.error) return this.displayError(this.props.error)
    if (!this.props.person) return <Loading />

    const { person, currentUser, match } = this.props
    const {
      avatarUrl,
      bannerUrl,
      bio,
      facebookUrl,
      linkedinUrl,
      location,
      name,
      role,
      twitterName,
      url,
      tagline
    } = person
    const { id, slug } = match.params
    const isMe = currentUser && currentUser.id === id
    const isAxolotl = AXOLOTL_ID === id

    const itemsMenuItems = [
      {icon: 'Ex', label: 'Block this Member', onClick: this.blockUser(id), hide: isMe || isAxolotl}
    ]

    return <div styleName='member-profile'>
      <ProfileBanner bannerUrl={bannerUrl}>
        <ProfileNamePlate
          avatarUrl={avatarUrl}
          location={location}
          name={name}
          role={role}
          rightSideContent={<MemberActionsMenu items={itemsMenuItems} />} />
      </ProfileBanner>
      <div styleName='content'>
        <ProfileControls currentTab={this.state.currentTab} selectTab={this.selectTab}>
          <span styleName='tagline'>{tagline}</span>
          <SocialButtons
            facebookUrl={facebookUrl}
            linkedinUrl={linkedinUrl}
            twitterName={twitterName}
            url={url} />
        </ProfileControls>
        <TabContentSwitcher
          bio={bio}
          currentTab={this.state.currentTab}
          personId={id}
          slug={slug} />
      </div>
    </div>
  }
}

const blockConfirmMessage = `Are you sure you want to block this member?
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

export function ProfileBanner ({ bannerUrl, children }) {
  return <div styleName='banner'>
    {children}
    {bannerUrl && <div style={bgImageStyle(bannerUrl)} styleName='banner-image' />}
  </div>
}

export function ProfileNamePlate ({ avatarUrl, name, location, role, rightSideContent }) {
  return <div styleName='name-plate-container'>
    <div styleName='name-plate'>
      <RoundImage styleName='avatar' url={avatarUrl} xlarge />
      <div styleName='details'>
        <h1 styleName='name'>{name}</h1>
        <div styleName='fine-details'>
          {location && <span styleName='location'>{location}</span>}
          {role && <span styleName='role-bling'>
            {location && <span styleName='spacer'>•</span>}
            <Icon styleName='star' name='StarCircle' />
            <span styleName='role'>{role}</span>
          </span>}
        </div>
      </div>
    </div>
    {rightSideContent && <div styleName='name-plate-right-side'>{rightSideContent}</div>}
  </div>
}

export function ProfileControls ({ children, currentTab, selectTab }) {
  return <div styleName='controls'>
    <div styleName='controls-children'>
      {children}
    </div>
    <hr styleName='separator' />
    <SimpleTabBar
      currentTab={currentTab}
      selectTab={selectTab}
      tabNames={['Overview', 'Posts', 'Comments', 'Upvotes']} />
  </div>
}

export function SocialButtons ({ facebookUrl, linkedinUrl, twitterName, url }) {
  return <div styleName='social-buttons'>
    {twitterName &&
      <a styleName='social-link' href={`https://twitter.com/${twitterName}`} target='_blank'>
        <Icon name='ProfileTwitter' styleName='icon icon-twitter' />
      </a>}
    {facebookUrl &&
      <a styleName='social-link' href={facebookUrl} target='_blank'>
        <Icon name='ProfileFacebook' styleName='icon icon-facebook' />
      </a>}
    {linkedinUrl &&
      <a styleName='social-link' href={linkedinUrl} target='_blank'>
        <Icon name='ProfileLinkedin' styleName='icon icon-linkedin' />
      </a>}
    {url &&
      <a styleName='social-link' href={url} target='_blank'>
        <Icon name='ProfileUrl' green styleName='icon' />
      </a>}
  </div>
}

export function TabContentSwitcher ({ bio, currentTab, navigate, personId, slug }) {
  switch (currentTab) {
    case 'Overview':
      return <div>
        <h2 styleName='subhead'>About Me</h2>
        <div styleName='bio'>{bio}</div>
        <RecentActivity personId={personId} slug={slug} />
      </div>

    case 'Posts':
      return <MemberPosts personId={personId} slug={slug} />

    case 'Comments':
      return <MemberComments personId={personId} slug={slug} />

    case 'Upvotes':
      return <MemberVotes personId={personId} slug={slug} />
  }
}
