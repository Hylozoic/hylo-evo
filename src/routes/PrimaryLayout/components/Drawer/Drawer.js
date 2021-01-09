import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { contextSwitchingUrl } from 'util/navigation'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from 'components/Badge/component.scss'
import { DEFAULT_AVATAR } from 'store/models/Group'
import cx from 'classnames'
import { isEmpty, sum } from 'lodash/fp'

const { string, number, arrayOf, shape } = PropTypes

export default class Drawer extends React.PureComponent {
  static propTypes = {
    group: shape({
      id: string,
      name: string,
      location: string,
      slug: string,
      avatarUrl: string
    }),
    memberships: arrayOf(shape({
      id: string,
      newPostCount: number,
      group: shape({
        name: string,
        slug: string,
        avatarUrl: string
      })
    }))
  }

  render () {
    const { currentLocation, group, groups, defaultNetworks, className, toggleDrawer, canModerate } = this.props
    const routeParams = this.props.match.params

    return <div className={className} styleName='s.groupDrawer'>
      <div styleName={cx({ 's.currentGroup': group !== null })}>
        <div styleName='s.hyloLogoBar'>
          <img src='/hylo.svg' width='50px' />
          <Icon name='Ex' styleName='s.closeDrawer' onClick={toggleDrawer} />
        </div>
        <Logo group={group} />
        {canModerate && <Link styleName='s.settingsLink' to={`/g/${group.slug}/settings`}>
          <Icon name='Settings' styleName='s.settingsIcon' /> Settings
        </Link>}
      </div>
      <div>
        <ul styleName='s.groupsList'>
          {defaultNetworks && defaultNetworks.map(network =>
            <NetworkRow network={network} routeParams={routeParams} currentLocation={currentLocation} key={network.id} />
          )}
        </ul>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>My Groups</li>
          {groups.map(group =>
            <GroupRow group={group} routeParams={routeParams} key={group.id} />
          )}
        </ul>
        <div styleName='s.newGroup'>
          <Button
            color='white'
            styleName='s.newGroupBtn'
            label='Start a Group'
            onClick={this.props.goToCreateGroup}
          />
        </div>
      </div>
    </div>
  }
}

export function GroupRow ({ group, isMember = true, routeParams }) {
  const { avatarUrl, newPostCount, name, slug } = group
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)
  const showBadge = newPostCount > 0
  return <li styleName='s.groupRow'>
    <Link to={contextSwitchingUrl({ slug }, routeParams)} styleName='s.groupRowLink' title={name}>
      <div styleName='s.groupRowAvatar' style={imageStyle} />
      <span styleName={cx('s.group-name', { 's.is-member': isMember })}>{name}</span>
      {showBadge && <Badge expanded number={newPostCount} />}
    </Link>
  </li>
}

export class NetworkRow extends React.Component {
  constructor (props) {
    super(props)
    const expanded = !!sum(props.network.groups.map(c => c.newPostCount))

    this.state = {
      expanded,
      seeAllExpanded: false
    }
  }

  toggleExpanded = e => {
    e.preventDefault()
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleSeeAll = e => {
    e.preventDefault()
    this.setState({
      seeAllExpanded: !this.state.seeAllExpanded
    })
  }

  render () {
    const { network, routeParams, currentLocation } = this.props
    const { groups, name, slug, context, avatarUrl, nonMemberGroups } = network
    const path = contextSwitchingUrl({ networkSlug: slug, context }, routeParams)
    const { expanded, seeAllExpanded } = this.state
    const newPostCount = sum(network.groups.map(c => c.newPostCount))
    const imageStyle = bgImageStyle(avatarUrl)
    const showGroups = !isEmpty(groups)

    return <li styleName={cx('s.networkRow', { 's.networkExpanded': expanded }, { 's.currentNetwork': currentLocation === path })}>
      <Link to={path} styleName='s.networkRowLink' title={name} className={badgeHoverStyles.parent}>
        <div styleName='s.network-name-wrapper'>
          <div styleName='s.avatar' style={imageStyle} />
          <span styleName='s.network-name'>{name}</span>
          {showGroups && <span styleName='s.groupsButton' onClick={this.toggleExpanded}>
            {expanded
              ? <Icon name='ArrowDown' styleName='s.arrowDown' />
              : newPostCount
                ? <Badge number={newPostCount} expanded />
                : <Icon name='ArrowForward' styleName='s.arrowForward' />}
          </span>}
        </div>
      </Link>
      {showGroups && expanded && <ul styleName='s.networkGroupsList'>
        {groups.map(group =>
          <GroupRow group={group} routeParams={routeParams} key={group.id} />)}
        {(seeAllExpanded && !isEmpty(nonMemberGroups)) && nonMemberGroups.map(group =>
          <GroupRow group={group} routeParams={routeParams} key={group.id} isMember={false} />)}
        {!isEmpty(nonMemberGroups) && <li styleName='s.seeAllBtn' onClick={this.toggleSeeAll}>
          {seeAllExpanded ? 'See less' : 'See all'}
        </li>}
      </ul>}
    </li>
  }
}

function Logo ({ group }) {
  if (!group) return null
  const { slug, name, location, avatarUrl } = group
  const link = `/g/${slug}`
  return <Link styleName='s.currentGroup' to={link}>
    <div styleName='s.avatar' style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
    <div className='drawer-inv-bd'>{name}</div>
    <div className='drawer-inv-sm'>{location}</div>
  </Link>
}
