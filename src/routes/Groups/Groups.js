import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'

import { DEFAULT_AVATAR } from 'store/models/Group'
import Button from 'components/Button'
// import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { groupUrl } from 'util/navigation'

import './Groups.scss'

export default class Groups extends Component {
  static propTypes = {
    childGroups: PropTypes.array,
    group: PropTypes.object,
    groupSlug: PropTypes.string,
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
      <div styleName='section'>
        <div styleName='banner'>
          <div styleName='banner-text'>
            {parentGroups.length} Parent Groups
          </div>
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
          <div styleName='banner-text'>
            {childGroups.length} Child Groups
          </div>
          <Button styleName='connect-button' onClick={this.toggleRequestToJoinPicker}>Request Membership</Button>
        </div>
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
    <Link to={groupUrl(group.slug, 'groups')}>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' square />
      <div styleName='group-details'>
        <span styleName='group-name'>{group.name}</span>
        <span styleName='group-stats'>{group.memberCount} Members</span>
      </div>
    </Link>
  </div>
}
