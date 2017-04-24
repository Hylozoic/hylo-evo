import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'
import React from 'react'
import './FeedBanner.scss'
import cx from 'classnames'
import { hyloLogo } from 'routes/AllCommunitiesFeed'

export default function FeedBanner ({ all, community, currentUser }) {
  let bannerUrl, avatarUrl, name, location, subtitle

  if (all) {
    name = 'All Communities'
    avatarUrl = hyloLogo
    subtitle = currentUser && `${currentUser.memberships.count()} Communities`
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = community)
  }

  return <div styleName={cx('banner', {'all-communities': all})}>
    <div style={bgImageStyle(bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName='logo' style={bgImageStyle(avatarUrl)} />
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
    <PostPrompt currentUser={currentUser} />
    <div styleName='shadow' />
  </div>
}

function PostPrompt ({ currentUser }) {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.firstName}, what's on your mind?
  </div>
}
