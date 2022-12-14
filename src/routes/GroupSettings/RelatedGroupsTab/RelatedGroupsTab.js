import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import { bgImageStyle } from 'util/index'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { GROUP_RELATIONSHIP_TYPE } from 'store/models/GroupRelationshipInvite'
import { groupUrl } from 'util/navigation'

import './RelatedGroupsTab.scss'

class RelatedGroupsTab extends Component {
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
      label: type === GROUP_RELATIONSHIP_TYPE.ParentToChild ? this.props.t('Remove Child') : this.props.t('Leave Parent'),
      onClick: () => {
        if (window.confirm(`Are you sure you want to ${GROUP_RELATIONSHIP_TYPE.ParentToChild ? 'remove' : 'leave'} ${this.props.group.name}?`)) { // TODO: Handle this translation
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

      <div styleName='title'>{this.props.t('Parent Groups')}</div>
      {parentGroups.length > 0 ? <div>
        <div styleName='subtitle'>{parentGroups.length === 1 ? this.props.t('This is the one group') : this.props.t('These are the {{length}} groups that {{group.name}} is a member of', { group, length: parentGroups.length })}</div>
        <div styleName='group-list' >
          {parentGroups.map(p => <GroupCard
            group={p}
            key={p.id}
            actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(p, group, GROUP_RELATIONSHIP_TYPE.ChildToParent)} styleName='relatedGroupDropdown' />}
          />)}
        </div>
      </div>
        : <div styleName='subtitle'>{this.props.t('{{group.name}} is not a member of any groups yet', { group })}</div>
      }

      {groupInvitesToJoinThem.length > 0 && <div>
        <div styleName='subtitle'>{this.props.t('Open Invitations to Join Other Groups')}</div>
        <div styleName='group-list'>
          {groupInvitesToJoinThem.map(invite => {
            return <GroupCard
              group={invite.fromGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='reject-button' onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' styleName='reject-icon' /></span>
                <span styleName='accept-button' onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' styleName='accept-icon' /> <span>{this.props.t('Join')}</span></span>
              </div>}
            />
          })}
        </div>
      </div> }

      {groupRequestsToJoinThem.length > 0 && <div>
        <div styleName='subtitle'>{this.props.t('Pending requests to join other groups')}</div>
        <div styleName='group-list'>
          {groupRequestsToJoinThem.map(invite => {
            return <GroupCard
              group={invite.toGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='cancel-button' onClick={cancelGroupRelationshipInvite(invite.id)}>{this.props.t('Cancel Request')}</span>
              </div>}
            />
          })}
        </div>
      </div> }

      <div styleName='group-picker-container'>
        <Button styleName='connect-button' onClick={this.toggleRequestToJoinPicker}>
          <div>
            <Icon name='Handshake' styleName='connect-icon' />
            {this.props.t('Join {{group.name}} to another group', { group })}
          </div>
          <span styleName='connect-label'>{this.props.t('REQUEST')}</span>
        </Button>
        {showRequestoJoinPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleParents.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={this.handleRequestToAddGroupToParent(membership.group, group)}>
                <b>{membership.hasModeratorRole ? this.props.t('Join') : this.props.t('Request')}</b>
                {membership.group.name}
              </span>
            </div>)}
          </div>
        </div>}
      </div>

      <div styleName='title'>{this.props.t('Child Groups')}</div>
      {childGroups.length > 0 ? <div>
        <div styleName='subtitle'>{childGroups.length === 1 ? this.props.t('This group is a member') : this.props.t('These {{childGroups.length}} groups are members of {{group.name}}', { childGroups, group })}</div>
        <div styleName='group-list'>
          {childGroups.map(c =>
            <GroupCard
              group={c}
              key={c.id}
              actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(group, c, GROUP_RELATIONSHIP_TYPE.ParentToChild)} styleName='relatedGroupDropdown' />}
            />)}
        </div>
      </div>
        : <div styleName='subtitle'>{this.props.t('No groups are members of {{group.name}} yet', { group })}</div>
      }

      {groupRequestsToJoinUs.length > 0 && <div>
        <div styleName='subtitle'>{this.props.t('Requests to join {{group.name}}', { group })}</div>
        <div styleName='group-list'>
          {groupRequestsToJoinUs.map(invite => {
            return <GroupCard
              group={invite.fromGroup}
              thisGroup={group}
              questionAnswers={invite.questionAnswers}
              key={invite.id}
              actionMenu={<div>
                <span styleName='reject-button' onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' styleName='reject-icon' /></span>
                <span styleName='accept-button' onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' styleName='accept-icon' /> <span>{this.props.t('Approve')}</span></span>
              </div>}
              type={GROUP_RELATIONSHIP_TYPE.ChildToParent}
            />
          })}
        </div>
      </div> }

      {groupInvitesToJoinUs.length > 0 && <div>
        <div styleName='subtitle'>{this.props.t('Pending invites to join {{group.name}}', { group })}</div>
        <div styleName='group-list'>
          {groupInvitesToJoinUs.map(invite => {
            return <GroupCard
              group={invite.toGroup}
              key={invite.id}
              actionMenu={<div>
                <span styleName='cancel-button' onClick={cancelGroupRelationshipInvite(invite.id)}>{this.props.t('Cancel Invite')}</span>
              </div>}
            />
          })}
        </div>
      </div> }

      <div styleName='group-picker-container'>
        <Button styleName='connect-button' onClick={this.toggleInviteAsChildPicker}>
          <div>
            <Icon name='Handshake' styleName='connect-icon' />
            {this.props.t('Invite a group to join <strong>{{group.name}}</strong>', { group })}
          </div>
          <span styleName='connect-label'>{this.props.t('INVITE')}</span>
        </Button>
        {showInviteAsChildPicker && <div styleName='group-picker'>
          <div styleName='group-picker-list'>
            {possibleChildren.map(membership => <div key={membership.id}>
              <span styleName='invite-button' onClick={this.handleInviteGroupToJoinParent(group.id, membership.group.id)}>
                <b>{membership.hasModeratorRole ? this.props.t('Add') : this.props.t('Invite')}</b>
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
//       placeholder={this.props.t('Search groups by name')}
//       onChange={event => setSearch(event.target.value)} />
//   </div>
// }

export function GroupCard ({ actionMenu, thisGroup, group, questionAnswers, type }) {
  // Answers to questions no longer being asked by the group
  const otherAnswers = questionAnswers ? questionAnswers.filter(qa => !thisGroup.groupToGroupJoinQuestions.find(jq => jq.questionId === qa.question.id)) : []
  const { t } = useTranslation()

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
          <div styleName='subtitle'>{q.text}</div>
          <p>{get('answer', questionAnswers && questionAnswers.find(qa => qa.question.id === q.questionId)) || <i>{t('Not answered')}</i>}</p>
        </div>
      )}
      {otherAnswers.map(qa =>
        <div styleName='answer' key={qa.id}>
          <div styleName='subtitle'>{qa.question.text}</div>
          <p>{qa.answer}</p>
        </div>
      )}
    </div>}
  </div>
}

export function RequestToJoinModal ({ group, hideRequestToJoinModal, parentGroup, requestToAddGroupToParent }) {
  const [questionAnswers, setQuestionAnswers] = useState(parentGroup.groupToGroupJoinQuestions.toModelArray().map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))
  const { t } = useTranslation()

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
          <span styleName='request-message'>{t('You are requesting that <strong>{{group.name}}</strong> become a member of <strong>{{parentGroup.name}}</strong>', { group, parentGroup })}</span>
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
          <div styleName='request-message-title'>{t('{{parentGroup.name}} requires groups to answer the following questions before joining', { parentGroup })}</div>
          {questionAnswers.map((q, index) => <div styleName='join-question' key={index}>
            <div styleName='subtitle'>{q.text}</div>
            <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={t('Type your answer here...')} />
          </div>)}
        </div>}
        <div styleName='request-bottom'>
          <Button onClick={() => { requestToAddGroupToParent(parentGroup.id, group.id, questionAnswers); hideRequestToJoinModal() }}>{t('Request to Join')}</Button>
        </div>
      </div>
    </div>
  </React.Fragment>
}

export default withTranslation()(RelatedGroupsTab)
