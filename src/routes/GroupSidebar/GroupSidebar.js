import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import Button from 'components/Button'
import './GroupSidebar.scss'
import cx from 'classnames'
import { personUrl, groupUrl } from 'util/navigation'
import { markdown } from 'hylo-utils/text'
import { isEmpty } from 'lodash/fp'

const { object, string, array } = PropTypes

export default class GroupSidebar extends Component {
  static propTypes = {
    slug: string,
    group: object,
    members: array,
    leaders: array
  }

  render () {
    const { group, members, leaders, canModerate } = this.props

    if (!group || isEmpty(members)) return <Loading />

    const { name, description, slug, memberCount } = group

    return <div styleName='group-sidebar'>
      <AboutSection name={name} description={description} />
      <SettingsLink canModerate={canModerate} group={group} />
      <MemberSection
        members={members}
        memberCount={memberCount}
        slug={slug}
        canModerate={canModerate} />
      <GroupLeaderSection leaders={leaders} slug={slug} />
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
    this.state = { expanded: false }
  }

  render () {
    const { name, description } = this.props
    let { expanded } = this.state

    if (!description) return null

    const onClick = () => this.setState({ expanded: !expanded })
    const showExpandButton = description.length > 155
    if (!showExpandButton) {
      expanded = true
    }

    return <div styleName='about-section'>
      <div styleName='header'>
        About {name}
      </div>
      <div styleName={cx('description', { expanded })}>
        {!expanded && <div styleName='gradient' />}
        <span dangerouslySetInnerHTML={{ __html: markdown(description) }} />
      </div>
      {showExpandButton && <span styleName='expand-button' onClick={onClick}>
        {expanded ? 'Show Less' : 'Read More'}
      </span>}
    </div>
  }
}

export function SettingsLink ({ canModerate, group }) {
  if (!canModerate) return null
  return <Link styleName='settings-link' to={groupUrl(group.slug, 'settings')}>
    Settings
  </Link>
}

export function MemberSection ({ members, memberCount, slug, canModerate }) {
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return <div styleName='member-section'>
    <Link to={groupUrl(slug, 'members')} styleName='members-link'>
      <div styleName='header'>Members</div>
      <div styleName='images-and-count'>
        <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
        {showTotal && <span styleName='members-total'>
          {formatTotal(memberCount - members.length)}
        </span>}
      </div>
    </Link>
    {canModerate && <Link to={groupUrl(slug, 'settings/invite')} styleName='invite-link'>
      <Button color='green-white-green-border'>Invite People</Button>
    </Link>}
  </div>
}

export function GroupLeaderSection ({ leaders, slug }) {
  return <div styleName='leader-section'>
    <div styleName='header leader-header'>Group Moderators</div>
    {leaders.map(l => <GroupLeader leader={l} slug={slug} key={l.id} />)}
  </div>
}

export function GroupLeader ({ leader, slug }) {
  const { name, avatarUrl } = leader
  return <div styleName='leader'>
    <Avatar url={personUrl(leader.id, slug)} avatarUrl={avatarUrl} styleName='leader-image' medium />
    <Link to={personUrl(leader.id, slug)} styleName='leader-name'>{name}</Link>
  </div>
}
