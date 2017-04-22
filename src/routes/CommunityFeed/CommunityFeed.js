import React from 'react'
import './CommunityFeed.scss'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import Feed from 'components/Feed'
import { bgImageStyle } from 'util/index'
import { get, pick } from 'lodash/fp'

export default class CommunityFeed extends React.Component {
  static defaultProps = {
    posts: [],
    selectedPostId: null
  }

  render () {
    const { community, currentUser } = this.props
    const feedProps = {
      subject: 'community',
      id: get('slug', community),
      ...pick([
        'filter',
        'sortBy',
        'changeSort',
        'changeTab',
        'showPostDetails',
        'selectedPostId'
      ], this.props)
    }

    return <div styleName='container'>
      <CommunityBanner community={community} currentUser={currentUser} />
      <Feed {...feedProps} />
    </div>
  }
}

export const CommunityBanner = ({ community, currentUser }) => {
  if (!community) return null
  return <div styleName='banner'>
    <div style={bgImageStyle(community.bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName='logo' style={bgImageStyle(community.avatarUrl)} />
        <div styleName='header-text'>
          <span styleName='header-name'>{community.name}</span>
          {community.location && <div styleName='header-location'>
            <Icon name='Location' styleName='header-icon' />
            {community.location}
          </div>}
        </div>
      </div>
    </div>
    <PostPrompt currentUser={currentUser} />
    <div styleName='shadow' />
  </div>
}

export const PostPrompt = ({ currentUser }) => {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.firstName}, what's on your mind?
  </div>
}
