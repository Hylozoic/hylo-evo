import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import './CommunitySidebar.scss'
const { object, string, array, number } = PropTypes
import cx from 'classnames'
import { personUrl } from 'util/index'

export default class CommunitySidebar extends Component {
  static propTypes = {
    commmunity: object,
    members: array,
    membersTotal: number
  }

  render () {
    const { community, members, membersTotal, leaders } = this.props
    if (!community) return <Loading />
    const { name, description, slug } = community
    return <div styleName='community-sidebar'>
      <AboutSection name={name} description={description} />
      <MemberSection members={members} membersTotal={membersTotal} />
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
    const { expanded } = this.state

    const onClick = () => this.setState({expanded: !expanded})

    return <div styleName='about-section'>
      <div styleName='header'>
        About {name}
      </div>
      <div styleName={cx('about', {expanded})}>
        {!expanded && <div styleName='gradient' />}
        {description}
      </div>
      <span styleName='expand-button' onClick={onClick}>
        {expanded ? 'Show Less' : 'Read More'}
      </span>
    </div>
  }
}

export function MemberSection ({ members, membersTotal }) {
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}`
  }

  const showTotal = membersTotal - members.length > 0

  return <div styleName='member-section'>
    <div styleName='header'>Members</div>
    <div styleName='images-and-count'>
      <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
      {showTotal && <span styleName='members-total'>
        {formatTotal(membersTotal - members.length)}
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
