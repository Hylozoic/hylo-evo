import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Community'
import './FeedBanner.scss'
import { whiteMerkaba, allCommunitiesBanner } from 'util/assets'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'

export default function FeedBanner ({ all, community, currentUser, newPost }) {
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
    <PostPrompt currentUser={currentUser} newPost={newPost} />
  </div>
}

class PostPrompt extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    newPost: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {hover: false}
  }

  onMouseEnterHandler = () => this.setState({hover: true})

  onMouseLeaveHandler = () => this.setState({hover: false})

  render () {
    const { currentUser, newPost } = this.props
    const { hover } = this.state
    if (!currentUser) return null
    return <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
      <div styleName='postPrompt' onClick={newPost}>
        <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
          Hi {currentUser.firstName()}, what's on your mind?
      </div>
      <div styleName={cx('shadow', { hover })} />
    </div>
  }
}
