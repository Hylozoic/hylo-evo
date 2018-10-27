import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Community'
import './FeedBanner.scss'
import { whiteMerkaba, allCommunitiesBanner } from 'util/assets'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'

export default function FeedBanner ({
  all,
  community,
  currentUser,
  newPost,
  postType,
  currentUserHasMemberships
}) {
  let bannerUrl, avatarUrl, name, location, subtitle

  if (all) {
    name = 'All Communities'
    avatarUrl = whiteMerkaba
    bannerUrl = allCommunitiesBanner
    subtitle = currentUser && `${currentUser.memberships.count()} Communities`
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = community)
  }

  return <div styleName={cx('banner', {'all-communities': all})}>
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName={cx('logo', {'all-logo': all})} style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
        <div styleName='header-text'>
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
    {currentUserHasMemberships && <PostPrompt currentUser={currentUser} postType={postType} newPost={newPost} />}
  </div>
}

export class PostPrompt extends React.Component {
  constructor (props) {
    super(props)
    this.state = {hover: false}
  }

  onMouseEnterHandler = () => this.setState({hover: true})

  onMouseLeaveHandler = () => this.setState({hover: false})

  render () {
    const { currentUser, newPost, postType, className } = this.props
    const { hover } = this.state

    if (!currentUser) return null

    const prompt = postType === 'project'
      ? `Create a project, make a team!`
      : `Hi ${currentUser.firstName()}, what's on your mind?`

    return <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
      <div styleName='postPrompt' className={className} onClick={newPost}>
        <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
        {prompt}
      </div>
      <div styleName={cx('shadow', { hover })} />
    </div>
  }
}
