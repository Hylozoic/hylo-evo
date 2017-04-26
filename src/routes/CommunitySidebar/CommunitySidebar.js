import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import './CommunitySidebar.scss'
const { object, string, array, func } = PropTypes
import cx from 'classnames'
import { personUrl } from 'util/index'
import { isEmpty } from 'lodash/fp'

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
    const { community, members, leaders } = this.props
    if (!community || isEmpty(members)) return <Loading />
    const { name, description, slug, memberCount } = community
    return <div styleName='community-sidebar'>
      <AboutSection name={name} description={description} />
      <MemberSection members={members} memberCount={memberCount} />
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
        {description}
      </div>
      {showExpandButton && <span styleName='expand-button' onClick={onClick}>
        {expanded ? 'Show Less' : 'Read More'}
      </span>}
    </div>
  }
}

export function MemberSection ({ members, memberCount }) {
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return <div styleName='member-section'>
    <div styleName='header'>Members</div>
    <div styleName='images-and-count'>
      <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
      {showTotal && <span styleName='members-total'>
        {formatTotal(memberCount - members.length)}
      </span>}
    </div>
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
