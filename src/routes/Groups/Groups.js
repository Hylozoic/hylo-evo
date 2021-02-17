import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import Button from 'components/Button'
import RoundImage from 'components/RoundImage'
import { groupUrl } from 'util/navigation'

import './Groups.scss'

export default class Groups extends Component {
  static propTypes = {
    childGroups: PropTypes.array,
    group: PropTypes.object,
    parentGroups: PropTypes.array,
    possibleChildren: PropTypes.array,
    possibleParents: PropTypes.array
  }

  constructor (props) {
    super(props)
    this.state = {
      showInviteAsChildPicker: false,
      showRequestToJoinPicker: false
    }
  }

  toggleInviteAsChildPicker = () => {
    this.setState({ showInviteAsChildPicker: !this.state.showInviteAsChildPicker })
  }

  toggleRequestToJoinPicker = () => {
    this.setState({ showRequestoJoinPicker: !this.state.showRequestoJoinPicker })
  }

  render () {
    const {
      canModerate,
      childGroups,
      group,
      inviteGroupToJoinParent,
      parentGroups,
      possibleChildren,
      possibleParents,
      requestToAddGroupToParent
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
          <Button styleName='connect-button' onClick={this.toggleInviteAsChildPicker}>Invite to</Button>
          { this.state.showInviteAsChildPicker && <div styleName='group-picker'>
            <h3>Invite {group.name} to one of your groups</h3>
            <div styleName='group-picker-list'>
              {possibleParents.map(g => <div key={g.id}>
                <span styleName='invite-button' onClick={inviteGroupToJoinParent(g.id, group.id)}>
                  {canModerate ? 'Add To' : 'Invite To'}
                </span>
                {g.name}
              </div>)}
            </div>
          </div>}
        </div>
        <GroupsList
          groups={parentGroups}
        />
      </div>

      <div styleName='section'>
        <div styleName='banner'>
          {childGroups.length === 1 ? <h3>1 Group is a part of {group.name}</h3> : ''}
          {childGroups.length > 1 ? <h3>{childGroups.length} groups are a part of {group.name}</h3> : ''}
          <Button styleName='connect-button' onClick={this.toggleRequestToJoinPicker}>Request Membership</Button>
          { this.state.showRequestoJoinPicker && <div styleName='group-picker'>
            <h3>Request group membership in {group.name}</h3>
            <div styleName='group-picker-list'>
              {possibleChildren.map(g => <div key={g.id}>
                <span styleName='invite-button' onClick={requestToAddGroupToParent(group.id, g.id)}>
                  {canModerate ? 'Join As' : 'Request As'}
                </span>
                {g.name}
              </div>)}
            </div>
          </div>}
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
