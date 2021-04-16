import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component, useState } from 'react'
import { bgImageStyle } from 'util/index'
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
      showRequestToJoinModalForGroup: false,
      showRequestToJoinPicker: false
    }
  }

  componentDidMount () {
    this.props.fetchGroupToGroupJoinQuestions()
  }

  toggleInviteAsChildPicker = () => {
    this.setState({ showInviteAsChildPicker: !this.state.showInviteAsChildPicker })
  }

  hideRequestToJoinModal = () => {
    this.setState({ showRequestToJoinModalForGroup: false })
  }

  showRequestToJoinModalForGroup = (parentGroup) => {
    this.setState({ showRequestToJoinModalForGroup: parentGroup })
  }

  toggleRequestToJoinPicker = () => {
    this.setState({ showRequestoJoinPicker: !this.state.showRequestoJoinPicker })
  }

  handleRequestToAddGroupToParent = (parentGroup, childGroup) => (e) => {
    console.log(parentGroup, parentGroup.settings, parentGroup.groupToGroupJoinQuestions.toModelArray())
    if (parentGroup.settings.askGroupToGroupJoinQuestions &&
          parentGroup.groupToGroupJoinQuestions &&
          parentGroup.groupToGroupJoinQuestions.toModelArray().length > 0) {
      this.showRequestToJoinModalForGroup(parentGroup)
    } else {
      this.props.requestToAddGroupToParent(parentGroup.id, childGroup.id)
    }
    this.toggleRequestToJoinPicker()
  }

  handleInviteGroupToJoinParent = (parentId, childId) => (e) => {
    this.props.inviteGroupToJoinParent(parentId, childId)
    this.toggleInviteAsChildPicker()
  }

  relationshipDropdownItems = (fromGroup, toGroup, type) => [
    {
      icon: 'Trash',
      label: type === GROUP_RELATIONSHIP_TYPE.ParentToChild ? 'Remove Child' : 'Leave Parent',
      onClick: () => {
        if (window.confirm(`Are you sure you want to ${GROUP_RELATIONSHIP_TYPE.ParentToChild ? 'remove' : 'leave'} ${this.props.group.name}?`)) {
          this.props.deleteGroupRelationship(fromGroup.id, toGroup.id)
        }
      },
      red: true
    }
  ]

  render () {
    const {
      acceptGroupRelationshipInvite,
      cancelGroupRelationshipInvite,
      group,
      childGroups,
      groupInvitesToJoinUs,
      groupInvitesToJoinThem,
      groupRequestsToJoinUs,
      groupRequestsToJoinThem,
      parentGroups,
      possibleChildren,
      possibleParents,
      rejectGroupRelationshipInvite,
      requestToAddGroupToParent
    } = this.props

    const { showInviteAsChildPicker, showRequestToJoinModalForGroup, showRequestoJoinPicker } = this.state

    return <div styleName='container'>
      {/* <SearchBar
        search={search}
        setSearch={setSearch}
         /> */}

      <h1>Parent Groups</h1>
      {parentGroups.length > 0 ? <div>
        <h3>{parentGroups.length === 1 ? 'This is the one group' : `These are the ${parentGroups.length} groups`} that {group.name} is a member of</h3>
        <div styleName='group-list' >
          {parentGroups.map(p => <GroupCard
            group={p}
            key={p.id}
            actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(p, group, GROUP_RELATIONSHIP_TYPE.ChildToParent)} styleName='relatedGroupDropdown' />}
          />)}
        </div>
      </div>
        : <h3>{group.name} is not a member of any groups yet</h3>
      }

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
        {showRequestoJoinPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleParents.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={this.handleRequestToAddGroupToParent(membership.group, group)}>
                <b>{membership.hasModeratorRole ? 'Join' : 'Request'}</b>
                {membership.group.name}
              </span>
            </div>)}
          </div>
        </div>}
      </div>

      <br />
      <h1>Child Groups</h1>
      {childGroups.length > 0 ? <div>
        <h3>{childGroups.length === 1 ? 'This group is a member' : `These ${childGroups.length} groups are members`} of {group.name}</h3>
        <div styleName='group-list'>
          {childGroups.map(c =>
            <GroupCard
              group={c}
              key={c.id}
              actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(group, c, GROUP_RELATIONSHIP_TYPE.ParentToChild)} styleName='relatedGroupDropdown' />}
            />)}
        </div>
      </div>
        : <h3>No groups are members of {group.name} yet</h3>
      }

      {groupRequestsToJoinUs.length > 0 && <div>
        <h3>Requests to join {group.name}</h3>
        <div styleName='group-list'>
          {groupRequestsToJoinUs.map(invite => {
            return <GroupCard
              group={invite.fromGroup}
              thisGroup={group}
              questionAnswers={invite.questionAnswers}
              key={invite.id}
              actionMenu={<div>
                <span styleName='reject-button' onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' styleName='reject-icon' /></span>
                <span styleName='accept-button' onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' styleName='accept-icon' /> <span>Approve</span></span>
              </div>}
              type={GROUP_RELATIONSHIP_TYPE.ChildToParent}
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
        {showInviteAsChildPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleChildren.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={this.handleInviteGroupToJoinParent(group.id, membership.group.id)}>
                <b>{membership.hasModeratorRole ? 'Add' : 'Invite'}</b>
                {membership.group.name}
              </span>
            </div>)}
          </div>
        </div>}
      </div>

      {showRequestToJoinModalForGroup && <RequestToJoinModal
        group={group}
        parentGroup={showRequestToJoinModalForGroup}
        requestToAddGroupToParent={requestToAddGroupToParent}
        hideRequestToJoinModal={this.hideRequestToJoinModal}
      />}
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

export function GroupCard ({ actionMenu, thisGroup, group, questionAnswers, type }) {
  // Answers to questions no longer being asked by the group
  const otherAnswers = questionAnswers ? questionAnswers.filter(qa => !thisGroup.groupToGroupJoinQuestions.find(jq => jq.questionId === qa.question.id)) : []

  return <div styleName='group-card-wrapper'>
    <div styleName='group-card'>
      <div styleName='group-details'>
        <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='30px' square />
        <Link to={groupUrl(group.slug)}><span styleName='group-name'>{group.name}</span></Link>
      </div>
      {actionMenu}
    </div>
    {type === GROUP_RELATIONSHIP_TYPE.ChildToParent &&
    thisGroup.settings.askGroupToGroupJoinQuestions &&
    thisGroup.groupToGroupJoinQuestions &&
    thisGroup.groupToGroupJoinQuestions && <div styleName='answer-wrapper'>
      {type === GROUP_RELATIONSHIP_TYPE.ChildToParent &&
      thisGroup.settings.askGroupToGroupJoinQuestions &&
      thisGroup.groupToGroupJoinQuestions &&
      thisGroup.groupToGroupJoinQuestions.map(q =>
        <div styleName='answer' key={q.id}>
          <h3>{q.text}</h3>
          <p>{get('answer', questionAnswers && questionAnswers.find(qa => qa.question.id === q.questionId)) || <i>Not answered</i>}</p>
        </div>
      )}
      {otherAnswers.map(qa =>
        <div styleName='answer' key={qa.id}>
          <h3>{qa.question.text}</h3>
          <p>{qa.answer}</p>
        </div>
      )}
    </div>}
  </div>
}

export function RequestToJoinModal ({ group, hideRequestToJoinModal, parentGroup, requestToAddGroupToParent }) {
  const [questionAnswers, setQuestionAnswers] = useState(parentGroup.groupToGroupJoinQuestions.toModelArray().map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))

  const setAnswer = (index) => (event) => {
    const answerValue = event.target.value
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [ ...prevAnswers ]
      newAnswers[index].answer = answerValue
      return newAnswers
    })
  }

  return <React.Fragment>
    <div styleName='request-modal-bg'>
      <div styleName='request-modal'>
        <div styleName='request-top'>
          <span styleName='modal-close-button' onClick={hideRequestToJoinModal}><Icon name='Ex' /></span>
          <span styleName='request-message'>You are requesting that <strong>{group.name}</strong> become a member of <strong>{parentGroup.name}</strong></span>
          <div styleName='join-example'>
            <div styleName='requesting-group' style={bgImageStyle(group.bannerUrl)}>
              <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='30px' square />
              <h4>{group.name}</h4>
            </div>
            <div styleName='requesting-icon'>
              <Icon name='Handshake' />
            </div>
            <div styleName='requested-parent-group' style={bgImageStyle(parentGroup.bannerUrl)}>
              <RoundImage url={parentGroup.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='30px' square />
              <h4>{parentGroup.name}</h4>
            </div>
          </div>
        </div>
        {questionAnswers && <div styleName='join-questions'>
          <div styleName='request-message-title'>{parentGroup.name} requires groups to answer the following questions before joining</div>
          {questionAnswers.map((q, index) => <div styleName='join-question' key={index}>
            <h3>{q.text}</h3>
            <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder='Type your answer here...' />
          </div>)}
        </div>}
        <div styleName='request-bottom'>
          <Button onClick={() => { requestToAddGroupToParent(parentGroup.id, group.id, questionAnswers); hideRequestToJoinModal() }}>Request to Join</Button>
        </div>
      </div>
    </div>
  </React.Fragment>
}
