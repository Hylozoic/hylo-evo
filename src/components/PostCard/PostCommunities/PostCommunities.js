import React, { Component } from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import { communityUrl, publicCommunitiesUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import { get, isEmpty, chunk } from 'lodash/fp'
import Icon from 'components/Icon'
import { DEFAULT_AVATAR } from 'store/models/Community'
import './PostCommunities.scss'

export default class PostCommunities extends Component {
  static defaultState = {
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = PostCommunities.defaultState
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { communities, slug, showBottomBorder } = this.props

    // don't show if there are no communities or this isn't cross posted
    if (isEmpty(communities) || (communities.length === 1 && get('0.slug', communities) === slug)) return null

    const { expanded } = this.state

    const content = expanded
      ? <span styleName='expandedSection' onClick={this.toggleExpanded}>
        <div styleName='row'>
          <span styleName='label'>Posted In:&nbsp;</span>
          <a onClick={this.toggleExpanded} styleName='expandLink'><Icon name='ArrowUp' styleName='expandIcon' /></a>
        </div>
        {chunk(2, communities).map(pair => <CommunityRow communities={pair} key={pair[0].id} />)}
      </span>
      : <div styleName='row'>
        <span styleName='label'>Posted In:&nbsp;</span>
        <CommunityList communities={communities} expandFunc={this.toggleExpanded} />
        <a onClick={this.toggleExpanded} styleName='expandLink'><Icon name='ArrowDown' styleName='expandIcon' /></a>
      </div>

    return <div styleName={cx('communities', { expanded, bottomBorder: showBottomBorder })}>
      {content}
    </div>
  }
}

function others (n, expandFunc) {
  if (n < 0) {
    return null
  } else if (n === 1) {
    return <a key='others' styleName='communityLink' onClick={expandFunc}>1 other</a>
  } else {
    return <a key='others' styleName='communityLink' onClick={expandFunc}>{n} others</a>
  }
}

export function CommunityList ({ communities, expandFunc }) {
  const renderCommunity = (community, comma) => {
    return <span key={community.id}><Link to={community.name === 'Public' ? publicCommunitiesUrl() : communityUrl(community.slug)} styleName='communityLink'>{community.name === 'Public' && <Icon name='Public' styleName='publicCommunityIcon' />} {community.name}</Link>{comma ? ', ' : ''}</span>
  }

  const maxShown = 2
  const length = communities.length
  const truncatedNames = (maxShown && maxShown < length)
    ? communities.slice(0, maxShown).map(c => renderCommunity(c, true)).concat([others(length - maxShown, expandFunc)])
    : communities.map((c, i) => renderCommunity(c, i !== communities.length - 1 && communities.length !== 2))

  const last = truncatedNames.pop()
  var elements
  if (isEmpty(truncatedNames)) {
    elements = [last]
  } else {
    elements = truncatedNames.concat([<span key='and'> and </span>, last])
  }

  return <span styleName='communityList'>
    {elements.map(e => e)}
  </span>
}

export function CommunityRow ({ communities }) {
  return <div styleName='communityRow'>
    {communities.map(community => <CommunityCell key={community.id} community={community} />)}
  </div>
}

export function CommunityCell ({ community }) {
  const { name, avatarUrl } = community
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)

  return <Link to={community.name === 'Public' ? publicCommunitiesUrl() : communityUrl(community.slug)} styleName='communityCell'>
    <div styleName='communityCellAvatar' style={imageStyle} />
    <span styleName='communityCellName'>{name}</span>
  </Link>
}
