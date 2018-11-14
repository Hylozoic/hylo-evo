import React from 'react'
import { get } from 'lodash/fp'
import { filter, isFunction } from 'lodash'
import { AXOLOTL_ID } from 'store/models/Person'
import { bgImageStyle } from 'util/index'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import Loading from 'components/Loading'
import SimpleTabBar from 'components/SimpleTabBar'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'
import MemberComments from './MemberComments'
import MemberVotes from './MemberVotes'
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
    const personId = get('match.params.personId', this.props)
    if (personId) this.props.fetchPerson(personId)
  }

  selectTab = currentTab => this.setState({currentTab})

  blockUser = (personId) => () => {
    if (window.confirm(BLOCK_CONFIRM_MESSAGE)) {
      this.props.blockUser(personId).then(this.props.goToPreviousLocation)
    }
  }

  render () {
    if (this.props.error) return <Error>this.props.error</Error>
    if (!this.props.person) return <Loading />

    const {
      person,
      currentUser,
      match: {params: routeParams},
      loading,
      showPostDetail
    } = this.props
    const {
      bannerUrl,
      bio,
      tagline
    } = person
    const { currentTab } = this.state
    const isMe = currentUser && currentUser.id === routeParams.personId
    const isAxolotl = AXOLOTL_ID === routeParams.personId

    const itemsMenuItems = [
      {icon: 'Ex', label: 'Block this Member', onClick: this.blockUser(routeParams.personId), hide: isMe || isAxolotl}
    ]

    return <div styleName='member-profile'>
      <ProfileBanner bannerUrl={bannerUrl}>
        <ProfileNamePlate {...person} rightSideContent={<MemberActionsMenu items={itemsMenuItems} />} />
      </ProfileBanner>
      <div styleName='content'>
        <ProfileControls currentTab={this.state.currentTab} selectTab={this.selectTab}>
          <span styleName='tagline'>{tagline}</span>
          <SocialButtons {...person} />
        </ProfileControls>
        {currentTab === 'Overview' && <div>
          <h2 styleName='subhead'>About Me</h2>
          <div styleName='bio'>{bio}</div>
          <RecentActivity showPostDetail={showPostDetail} {...routeParams} loading={loading} />
        </div>}
        {currentTab === 'Posts' &&
          <MemberPosts {...routeParams} loading={loading} />}
        {currentTab === 'Comments' &&
          <MemberComments showPostDetail={showPostDetail} {...routeParams} loading={loading} />}
        {currentTab === 'Upvotes' &&
          <MemberVotes {...routeParams} loading={loading} />}
      </div>
    </div>
  }
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

export function Error ({ children }) {
  return <div styleName='member-profile'>
    <span styleName='error'>{children}</span>
  </div>
}
