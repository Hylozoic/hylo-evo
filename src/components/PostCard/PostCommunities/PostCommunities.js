import React, { Component } from 'react'
import { get, isEmpty } from 'lodash/fp'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { communityUrl } from 'util/navigation'
import CommunitiesList from 'components/CommunitiesList'
import Icon from 'components/Icon'
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
    const { communities, constrained, slug, showBottomBorder } = this.props
    const { expanded } = this.state

    // don't show if there are no communities or this isn't cross posted
    if (isEmpty(communities) || (communities.length === 1 && get('0.slug', communities) === slug)) return null

    return <div styleName={cx('communities', { constrained, expanded, bottomBorder: showBottomBorder })} onClick={expanded ? this.toggleExpanded : undefined}>
      <div styleName='row'>
        <span styleName='label'>Posted In:&nbsp;</span>
        {!expanded &&
          <LinkedCommunityNameList communities={communities} maxShown={2} expandFunc={this.toggleExpanded} />}
        <a onClick={this.toggleExpanded} styleName='expandLink'><Icon name={expanded ? 'ArrowUp' : 'ArrowDown'} styleName='expandIcon' /></a>
      </div>

      {expanded && <CommunitiesList communities={communities} />}
    </div>
  }
}

export function LinkedCommunityNameList ({ communities, maxShown = 2, expandFunc }) {
  const communitiesToDisplay = (maxShown && maxShown <= communities.length)
    ? communities.slice(0, maxShown)
    : communities
  const othersCount = communities.length - communitiesToDisplay.length

  return <span styleName='communityList'>
    {communitiesToDisplay.map((community, i) =>
      <LinkedCommunityName community={community} key={i}>
        <Separator currentIndex={i} displayCount={communitiesToDisplay.length} othersCount={othersCount} />
      </LinkedCommunityName>)}
    {othersCount > 0 &&
      <Others othersCount={othersCount} expandFunc={expandFunc} />}
  </span>
}

export function LinkedCommunityName ({ community, children }) {
  return <span key={community.id}>
    <Link to={communityUrl(community.slug)} styleName='communityLink'>{community.name === 'Public' && <Icon name='Public' styleName='publicCommunityIcon' />} {community.name}</Link>
    {children}
  </span>
}

export function Separator ({ currentIndex, displayCount, othersCount }) {
  const isLastEntry = currentIndex === displayCount - 1
  const isNextToLastEntry = currentIndex === Math.max(0, displayCount - 2)
  const hasOthers = othersCount > 0

  if (isLastEntry) return null
  if (!hasOthers && isNextToLastEntry) return <span key='and'> and </span>

  return <span>, </span>
}

export function Others ({ othersCount, expandFunc }) {
  if (othersCount < 0) return null

  const phrase = othersCount === 1 ? '1 other' : othersCount + ' others'

  return <React.Fragment>
    <span key='and'> and </span>
    <a key='others' styleName='communityLink' onClick={expandFunc}>{phrase}</a>
  </React.Fragment>
}
