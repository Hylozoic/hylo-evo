import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'

import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { GROUP_RELATIONSHIP_TYPE } from 'store/models/GroupRelationshipInvite'
import { groupUrl } from 'util/navigation'

import './RelatedGroupsTab.scss'

export default class RelatedGroupsTab extends Component {
  static propTypes = {
    childGroups: PropTypes.array.isRequired,
    deleteGroupRelationship: PropTypes.func.isRequired,
    group: PropTypes.object.isRequired,
    inviteGroupToJoinParent: PropTypes.func.isRequired,
    parentGroups: PropTypes.array.isRequired,
    possibleChildren: PropTypes.array.isRequired,
    possibleParents: PropTypes.array.isRequired,
    requestToAddGroupToParent: PropTypes.func.isRequired,
    search: PropTypes.string,
    setSearch: PropTypes.func
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
      acceptGroupRelationshipInvite,
      cancelGroupRelationshipInvite,
      deleteGroupRelationship,
      group,
      childGroups,
      groupInvitesToJoinUs,
      groupInvitesToJoinThem,
      groupRequestsToJoinUs,
      groupRequestsToJoinThem,
      inviteGroupToJoinParent,
      parentGroups,
      possibleChildren,
      possibleParents,
      rejectGroupRelationshipInvite,
      requestToAddGroupToParent
    } = this.props

    const relationshipDropdownItems = (fromGroup, toGroup, type) => [
      {
        icon: 'Trash',
        label: type === GROUP_RELATIONSHIP_TYPE.ParentToChild ? 'Remove Child' : 'Leave Parent',
        onClick: () => {
          if (window.confirm(`Are you sure you want to ${GROUP_RELATIONSHIP_TYPE.ParentToChild ? 'remove' : 'leave'} ${group.name}?`)) {
            deleteGroupRelationship(fromGroup.id, toGroup.id)
          }
        },
        red: true
      }
    ]

    return <div styleName='container'>
      {/* <SearchBar
        search={search}
        setSearch={setSearch}
         /> */}

      <h1>Parent Groups</h1>
      {parentGroups.length > 0 && <div>
        <h3>These are the {parentGroups.length} groups that {group.name} is a member of</h3>
        <div styleName='group-list' >
          {parentGroups.map(p => <GroupCard
            group={p}
            key={p.id}
            actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={relationshipDropdownItems(p, group, GROUP_RELATIONSHIP_TYPE.ChildToParent)} />}
          />)}
        </div>
      </div> }

      {groupInvitesToJoinThem.length > 0 && <div>
        <h3>Open Invitations to Join Other Groups</h3>
        <div styleName='group-list'>
          {groupInvitesToJoinThem.map(invite => {
            return <GroupCard
              group={invite.fromGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='reject-button' onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' styleName='reject-icon' /></span>
                <span styleName='accept-button' onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' styleName='accept-icon' /> <span>Join</span></span>
              </div>}
            />
          })}
        </div>
      </div> }

      {groupRequestsToJoinThem.length > 0 && <div>
        <h3>Pending requests to join other groups</h3>
        <div styleName='group-list'>
          {groupRequestsToJoinThem.map(invite => {
            return <GroupCard
              group={invite.toGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='cancel-button' onClick={cancelGroupRelationshipInvite(invite.id)}>Cancel Request</span>
              </div>}
            />
          })}
        </div>
      </div> }

      <div styleName='group-picker-container'>
        <Button styleName='connect-button' onClick={this.toggleRequestToJoinPicker}>
          <div>
            <Icon name='Handshake' styleName='connect-icon' />
            Join {group.name} to another group
          </div>
          <span styleName='connect-label'>REQUEST</span>
        </Button>
        {this.state.showRequestoJoinPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleParents.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={requestToAddGroupToParent(membership.group.id, group.id)}>
                <b>{membership.hasModeratorRole ? 'Join' : 'Request'}</b>
                {membership.group.name}
              </span>
            </div>)}
          </div>
        </div>}
      </div>

      <h1>Child Groups</h1>
      {childGroups.length > 0 && <div>
        <h3>These {childGroups.length} groups are members of {group.name}</h3>
        <div styleName='group-list'>
          {childGroups.map(c =>
            <GroupCard
              group={c}
              key={c.id}
              actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={relationshipDropdownItems(group, c, GROUP_RELATIONSHIP_TYPE.ParentToChild)} />}
            />)}
        </div>
      </div> }

      {groupRequestsToJoinUs.length > 0 && <div>
        <h3>Requests to join {group.name}</h3>
        <div styleName='group-list'>
          {groupRequestsToJoinUs.map(invite => {
            return <GroupCard
              group={invite.fromGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='reject-button' onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' styleName='reject-icon' /></span>
                <span styleName='accept-button' onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' styleName='accept-icon' /> <span>Approve</span></span>
              </div>}
            />
          })}
        </div>
      </div> }

      {groupInvitesToJoinUs.length > 0 && <div>
        <h3>Pending invites to join {group.name}</h3>
        <div styleName='group-list'>
          {groupInvitesToJoinUs.map(invite => {
            return <GroupCard
              group={invite.toGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='cancel-button' onClick={cancelGroupRelationshipInvite(invite.id)}>Cancel Invite</span>
              </div>}
            />
          })}
        </div>
      </div> }

      <div styleName='group-picker-container'>
        <Button styleName='connect-button' onClick={this.toggleInviteAsChildPicker}>
          <div>
            <Icon name='Handshake' styleName='connect-icon' />
            Invite a group to join <strong>{group.name}</strong>
          </div>
          <span styleName='connect-label'>INVITE</span>
        </Button>
        {this.state.showInviteAsChildPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleChildren.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={inviteGroupToJoinParent(group.id, membership.group.id)}>
                <b>{membership.hasModeratorRole ? 'Add' : 'Invite'}</b>
                {membership.group.name}
              </span>
            </div>)}
          </div>
        </div>}
      </div>

    </div>
  }
}

// export function SearchBar ({ search, setSearch }) {
//   var selected = find(o => o.id === sortBy, sortOptions)

//   if (!selected) selected = sortOptions[0]

//   return <div styleName='search-bar'>
//     <TextInput styleName='search-input'
//       value={search}
//       placeholder='Search groups by name'
//       onChange={event => setSearch(event.target.value)} />
//   </div>
// }

export function GroupCard ({ group, type, actionMenu }) {
  return <div styleName='group-card'>
    <div styleName='group-details'>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='30px' square />
      <Link to={groupUrl(group.slug)}><span styleName='group-name'>{group.name}</span></Link>
    </div>
    {actionMenu}
  </div>
}
