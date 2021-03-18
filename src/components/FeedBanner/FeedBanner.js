import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import './FeedBanner.scss'
import { whiteMerkaba, allGroupsBanner, publicGlobe } from 'util/assets'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'

export default function FeedBanner ({
  context,
  group,
  currentUser,
  newPost,
  type,
  urlLocation,
  currentUserHasMemberships
}) {
  let bannerUrl, avatarUrl, name, location, subtitle

  if (context === 'all') {
    name = 'All My Groups'
    avatarUrl = whiteMerkaba
    bannerUrl = allGroupsBanner
    subtitle = currentUser && `${currentUser.memberships.count()} Groups`
  } else if (context === 'public') {
    name = 'Public Groups & Posts'
    avatarUrl = publicGlobe
    bannerUrl = allGroupsBanner
    // TODO list count of public posts and public groups in subtitle
    subtitle = `All Posts Marked Public`
  } else if (!group) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = group)
  }

  return <div styleName={cx('banner', { 'all-groups': context === 'all' })}>
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName={cx('logo', { 'all-logo': context === 'all' })} style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
        <div styleName='header-text'>
          <div styleName='header-contents'>
            <span styleName='header-name'>{name}</span>
            {location && <div styleName='header-subtitle'>
              <Icon name='Location' styleName='header-icon' />
              {location}
            </div>}
            {subtitle && <div styleName='header-subtitle'>
              {subtitle}
            </div>}
          </div>
        </div>
      </div>
    </div>
    {currentUserHasMemberships && <PostPrompt
      type={type}
      location={urlLocation}
      firstName={currentUser.firstName()}
      avatarUrl={currentUser.avatarUrl}
      newPost={newPost} />}
  </div>
}

export function postPromptString (type = '', { firstName }) {
  const postPrompts = {
    offer: `Hi ${firstName}, what would you like to share?`,
    request: `Hi ${firstName}, what are you looking for?`,
    project: `Hi ${firstName}, what would you like to create?`,
    event: `Hi ${firstName}, want to create an event?`,
    default: `Hi ${firstName}, what's on your mind?`
  }

  return postPrompts[type] || postPrompts['default']
}

export class PostPrompt extends React.Component {
  static defaultProps = {
    type: '',
    location: '',
    firstName: '',
    promptStringFunc: postPromptString
  }

  constructor (props) {
    super(props)
    this.state = { hover: false }
  }

  onMouseEnterHandler = () => this.setState({ hover: true })

  onMouseLeaveHandler = () => this.setState({ hover: false })

  render () {
    const { type, location, avatarUrl, firstName, promptStringFunc, className } = this.props
    const { hover } = this.state

    return <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
      <Link to={location.pathname + '/create/post?newPostType=' + type}>
        <div styleName='postPrompt' className={className}>
          <RoundImage url={avatarUrl} small styleName='prompt-image' />
          {promptStringFunc(type, { firstName })}
        </div>
      </Link>
      <div styleName={cx('shadow', { hover })} />
    </div>
  }
}
