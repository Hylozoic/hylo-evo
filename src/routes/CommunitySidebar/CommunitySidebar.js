import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import './CommunitySidebar.scss'
const { object, string, array, func } = PropTypes
import cx from 'classnames'
import { personUrl, communitySettingsUrl } from 'util/index'
import { markdown } from 'hylo-utils/text'
import { isEmpty } from 'lodash/fp'
import { canModerate } from 'store/models/Me'

export default class CommunitySidebar extends Component {
  static propTypes = {
    slug: string,
    commmunity: object,
    members: array,
    leaders: array,
    fetchCommunity: func
  }

  componentDidMount () {
    this.props.fetchCommunity()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.slug !== this.props.slug) {
      this.props.fetchCommunity()
    }
  }

  render () {
    const { community, members, leaders, currentUser } = this.props
    if (!community || isEmpty(members)) return <Loading />
    const { name, description, slug, memberCount } = community
    return <div styleName='community-sidebar'>
      <AboutSection name={name} description={description} />
      <SettingsLink currentUser={currentUser} community={community} />
      <MemberSection members={members} memberCount={memberCount} slug={slug} />
      <CommunityLeaderSection leaders={leaders} slug={slug} />
    </div>
  }
}

export class AboutSection extends Component {
  static propTypes = {
    name: string,
    description: string
  }

  constructor (props) {
    super(props)
    this.state = {expanded: false}
  }

  render () {
    const { name, description } = this.props
    let { expanded } = this.state

    if (!description) return null

    const onClick = () => this.setState({expanded: !expanded})
    const showExpandButton = description.length > 155
    if (!showExpandButton) {
      expanded = true
    }

    return <div styleName='about-section'>
      <div styleName='header'>
        About {name}
      </div>
      <div styleName={cx('description', {expanded})}>
        {!expanded && <div styleName='gradient' />}
        <span dangerouslySetInnerHTML={{__html: markdown(description)}} />
      </div>
      {showExpandButton && <span styleName='expand-button' onClick={onClick}>
        {expanded ? 'Show Less' : 'Read More'}
      </span>}
    </div>
  }
}

export function SettingsLink ({ currentUser, community }) {
  if (!canModerate(currentUser, community)) return null
  return <Link styleName='settings-link' to={communitySettingsUrl(community.slug)}>
    Settings
  </Link>
}

export function MemberSection ({ members, memberCount, slug }) {
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return <div styleName='member-section'>
    <Link to={`/c/${slug}/members`} styleName='members-link'>
      <div styleName='header'>Members</div>
      <div styleName='images-and-count'>
        <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
        {showTotal && <span styleName='members-total'>
          {formatTotal(memberCount - members.length)}
        </span>}
      </div>
    </Link>
  </div>
}

export function CommunityLeaderSection ({ leaders, slug }) {
  return <div styleName='leader-section'>
    <div styleName='header leader-header'>Community Leaders</div>
    {leaders.map(l => <CommunityLeader leader={l} slug={slug} key={l.id} />)}
  </div>
}

export function CommunityLeader ({ leader, slug }) {
  const { name, avatarUrl } = leader
  return <div styleName='leader'>
    <Avatar url={personUrl(leader.id, slug)} avatarUrl={avatarUrl} styleName='leader-image' medium />
    <Link to={personUrl(leader.id, slug)} styleName='leader-name'>{name}</Link>
  </div>
}
