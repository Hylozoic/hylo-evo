import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import RoundImage from 'components/RoundImage'
import { groupUrl } from 'util/navigation'

import './Groups.scss'

export default class Groups extends Component {
  static propTypes = {
    childGroups: PropTypes.array,
    group: PropTypes.object,
    parentGroups: PropTypes.array
  }

  render () {
    const {
      childGroups,
      group,
      parentGroups
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
        />
      </div>

      <div styleName='section'>
        <div styleName='banner'>
          {childGroups.length === 1 ? <h3>1 Group is a part of {group.name}</h3> : ''}
          {childGroups.length > 1 ? <h3>{childGroups.length} groups are a part of {group.name}</h3> : ''}
        </div>
        <GroupsList
          groups={childGroups}
        />
      </div>
    </div>
  }
}

export function GroupsList ({ groups }) {
  return <div styleName='group-list' >
    {groups.map(c => <GroupCard group={c} key={c.id} />)}
  </div>
}

export function GroupCard ({ group }) {
  return <div styleName='group-card'>
    <Link to={groupUrl(group.slug, 'groups')} styleName='groupLink'>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' square />
      <div styleName='group-details'>
        <span styleName='group-name'>{group.name}</span>
        <span styleName='group-stats'>{group.memberCount} Members</span>
        <span styleName='group-description'>{group.description}</span>
      </div>
    </Link>
    <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='groupCardBackground'><div /></div>
  </div>
}
