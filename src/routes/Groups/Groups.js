import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'

import RoundImage from 'components/RoundImage'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import { groupUrl, groupDetailUrl } from 'util/navigation'

import './Groups.scss'

export default class Groups extends Component {
  static propTypes = {
    childGroups: PropTypes.array,
    group: PropTypes.object,
    parentGroups: PropTypes.array,
    routeParams: PropTypes.object
  }

  render () {
    const {
      childGroups,
      group,
      parentGroups,
      routeParams
    } = this.props

    return <div styleName='container'>
      <div styleName='network-map'><span>Group network map in progress</span></div>

      {/* <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSort={setSort} /> */}

      <div styleName='section'>
        <div styleName='banner'>
          {parentGroups.length === 1 ? <h3>{group.name} is a part of 1 Group</h3> : '' }
          {parentGroups.length > 1 ? <h3>{group.name} is a part of {parentGroups.length} Groups</h3> : '' }
        </div>
        <GroupsList
          groups={parentGroups}
          routeParams={routeParams}
        />
      </div>

      <div styleName='section'>
        <div styleName='banner'>
          {childGroups.length === 1 ? <h3>1 Group is a part of {group.name}</h3> : ''}
          {childGroups.length > 1 ? <h3>{childGroups.length} groups are a part of {group.name}</h3> : ''}
        </div>
        <GroupsList
          groups={childGroups}
          routeParams={routeParams}
        />
      </div>
    </div>
  }
}

export function GroupsList ({ groups, routeParams }) {
  return <div styleName='group-list' >
    {groups.map(c => <GroupCard group={c} key={c.id} routeParams={routeParams} />)}
  </div>
}

export function GroupCard ({ group, routeParams }) {
  return <div styleName='group-card'>
    <Link to={group.memberStatus === 'member' ? groupUrl(group.slug, 'groups') : groupDetailUrl(group.slug, routeParams)} styleName='groupLink'>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' square />
      <div styleName='group-details'>
        <span styleName='group-name'>{group.name}</span>
        <span styleName='group-stats'>{group.memberCount} Members</span>
        <span styleName='group-description'>{group.description}</span>
        <span>{
          group.memberStatus === 'member' ? 'Already a member'
            : group.memberStatus === 'requested' ? 'Requested to Join'
              : 'Join'
        }
        </span>
      </div>
    </Link>
    <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='groupCardBackground'><div /></div>
  </div>
}
