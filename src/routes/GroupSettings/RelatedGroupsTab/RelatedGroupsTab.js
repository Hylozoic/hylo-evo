import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { GROUP_RELATIONSHIP_TYPE } from 'store/models/GroupRelationshipInvite'
import { groupUrl } from 'util/navigation'

import classes from './RelatedGroupsTab.module.scss'

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

  relationshipDropdownItems = (fromGroup, toGroup, type) => {
    const { t } = this.props
    return [
      {
        icon: 'Trash',
        label: type === GROUP_RELATIONSHIP_TYPE.ParentToChild ? t('Remove Child') : t('Leave Parent'),
        onClick: () => {
          if (window.confirm(GROUP_RELATIONSHIP_TYPE.ParentToChild
            ? t('Are you sure you want to remove {{groupName}}', { groupName: this.props.group.name })
            : t('Are you sure you want to leave {{groupName}}', { groupName: this.props.group.name }))) {
            this.props.deleteGroupRelationship(fromGroup.id, toGroup.id)
          }
        },
        red: true
      }
    ]
  }

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
      requestToAddGroupToParent,
      t
    } = this.props

    const { showInviteAsChildPicker, showRequestToJoinModalForGroup, showRequestoJoinPicker } = this.state

    return (
      <div className={classes.container}>
        {/* <SearchBar
          search={search}
          setSearch={setSearch}
          /> */}

        <div className={classes.title}>{t('Parent Groups')}</div>
        {parentGroups.length > 0 ? <div>
          <div className={classes.subtitle}>{parentGroups.length === 1 ? t('This is the one group') : t('These are the {{length}} groups that {{group.name}} is a member of', { group, length: parentGroups.length })}</div>
          <div className={classes.groupList} >
            {parentGroups.map(p => <GroupCard
              group={p}
              key={p.id}
              actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(p, group, GROUP_RELATIONSHIP_TYPE.ChildToParent)} className={classes.relatedGroupDropdown} />}
            />)}
          </div>
        </div>
          : <div className={classes.subtitle}>{t('{{group.name}} is not a member of any groups yet', { group })}</div>
        }

        {groupInvitesToJoinThem.length > 0 && <div>
          <div className={classes.subtitle}>{t('Open Invitations to Join Other Groups')}</div>
          <div className={classes.groupList}>
            {groupInvitesToJoinThem.map(invite => {
              return (
                <GroupCard
                  group={invite.fromGroup}
                  key={invite.id}
                  actionMenu={<div>
                    <span className={classes.rejectButton} onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' className={classes.rejectIcon} /></span>
                    <span className={classes.acceptButton} onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' className={classes.acceptIcon} /> <span>{t('Join')}</span></span>
                  </div>}
                />
              )
            })}
          </div>
        </div> }

        {groupRequestsToJoinThem.length > 0 && <div>
          <div className={classes.subtitle}>{t('Pending requests to join other groups')}</div>
          <div className={classes.groupList}>
            {groupRequestsToJoinThem.map(invite => {
              return (
                <GroupCard
                  group={invite.toGroup}
                  key={invite.id}
                  actionMenu={<div>
                    <span className={classes.cancelButton} onClick={cancelGroupRelationshipInvite(invite.id)}>{t('Cancel Request')}</span>
                  </div>}
                />
              )
            })}
          </div>
        </div> }

        <div className={classes.groupPickerContainer}>
          <Button className={classes.connectButton} onClick={this.toggleRequestToJoinPicker}>
            <div>
              <Icon name='Handshake' className={classes.connectIcon} />
              {t('Join {{group.name}} to another group', { group })}
            </div>
            <span className={classes.connectLabel}>{t('REQUEST')}</span>
          </Button>
          {showRequestoJoinPicker && <div className={classes.groupPicker}>
            <div className={classes.groupPickerList}>
              {possibleParents.map(membership => <div key={membership.id}>
                <span className={classes.inviteButton} onClick={this.handleRequestToAddGroupToParent(membership.group, group)}>
                  <b>{membership.hasAdministrationAbility ? t('Join') : t('Request')}</b>
                  {membership.group.name}
                </span>
              </div>)}
            </div>
          </div>}
        </div>

        <div className={classes.title}>{t('Child Groups')}</div>
        {childGroups.length > 0 ? <div>
          <div className={classes.subtitle}>{childGroups.length === 1 ? t('This group is a member') : t('These {{childGroups.length}} groups are members of {{group.name}}', { childGroups, group })}</div>
          <div className={classes.groupList}>
            {childGroups.map(c =>
              <GroupCard
                group={c}
                key={c.id}
                actionMenu={<Dropdown toggleChildren={<Icon name='More' />} items={this.relationshipDropdownItems(group, c, GROUP_RELATIONSHIP_TYPE.ParentToChild)} className={classes.relatedGroupDropdown} />}
              />)}
          </div>
        </div>
          : <div className={classes.subtitle}>{t('No groups are members of {{group.name}} yet', { group })}</div>
        }

        {groupRequestsToJoinUs.length > 0 && <div>
          <div className={classes.subtitle}>{t('Requests to join {{group.name}}', { group })}</div>
          <div className={classes.groupList}>
            {groupRequestsToJoinUs.map(invite => {
              return (
                <GroupCard
                  group={invite.fromGroup}
                  thisGroup={group}
                  questionAnswers={invite.questionAnswers}
                  key={invite.id}
                  actionMenu={<div>
                    <span className={classes.rejectButton} onClick={rejectGroupRelationshipInvite(invite.id)}><Icon name='Ex' className={classes.rejectIcon} /></span>
                    <span className={classes.acceptButton} onClick={acceptGroupRelationshipInvite(invite.id)}><Icon name='Heart' className={classes.acceptIcon} /> <span>{t('Approve')}</span></span>
                  </div>}
                  type={GROUP_RELATIONSHIP_TYPE.ChildToParent}
                />
              )
            })}
          </div>
        </div> }

        {groupInvitesToJoinUs.length > 0 && <div>
          <div className={classes.subtitle}>{t('Pending invites to join {{group.name}}', { group })}</div>
          <div className={classes.groupList}>
            {groupInvitesToJoinUs.map(invite => {
              return (
                <GroupCard
                  group={invite.toGroup}
                  key={invite.id}
                  actionMenu={<div>
                    <span className={classes.cancelButton} onClick={cancelGroupRelationshipInvite(invite.id)}>{t('Cancel Invite')}</span>
                  </div>}
                />
              )
            })}
          </div>
        </div> }

        <div className={classes.groupPickerContainer}>
          <Button className={classes.connectButton} onClick={this.toggleInviteAsChildPicker}>
            <div>
              <Icon name='Handshake' className={classes.connectIcon} />
              {t('Invite a group to join')}{' '}<strong>{group.name}</strong>
            </div>
            <span className={classes.connectLabel}>{t('INVITE')}</span>
          </Button>
          {showInviteAsChildPicker && <div className={classes.groupPicker}>
            <div className={classes.groupPickerList}>
              {possibleChildren.map(membership => <div key={membership.id}>
                <span className={classes.inviteButton} onClick={this.handleInviteGroupToJoinParent(group.id, membership.group.id)}>
                  <b>{membership.hasAdministrationAbility ? t('Add') : t('Invite')}</b>
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
    )
  }
}

// export function SearchBar ({ search, setSearch }) {
//   var selected = find(o => o.id === sortBy, sortOptions)

//   if (!selected) selected = sortOptions[0]

//   return <div className={classes.searchBar}>
//     <TextInput className={classes.searchInput}
//       value={search}
//       placeholder={this.props.t('Search groups by name')}
//       onChange={event => setSearch(event.target.value)} />
//   </div>
// }

export function GroupCard ({ actionMenu, thisGroup, group, questionAnswers, type }) {
  // Answers to questions no longer being asked by the group
  const otherAnswers = questionAnswers ? questionAnswers.filter(qa => !thisGroup.groupToGroupJoinQuestions.find(jq => jq.questionId === qa.question.id)) : []
  const { t } = useTranslation()

  return (
    <div className={classes.groupCardWrapper}>
      <div className={classes.groupCard}>
        <div className={classes.groupDetails}>
          <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} className={cx(classes.groupImage, classes.square)} size='30px' />
          <Link to={groupUrl(group.slug)}><span className={classes.groupName}>{group.name}</span></Link>
        </div>
        {actionMenu}
      </div>
      {type === GROUP_RELATIONSHIP_TYPE.ChildToParent &&
      thisGroup.settings.askGroupToGroupJoinQuestions &&
      thisGroup.groupToGroupJoinQuestions &&
      thisGroup.groupToGroupJoinQuestions && <div className={classes.answerWrapper}>
        {type === GROUP_RELATIONSHIP_TYPE.ChildToParent &&
        thisGroup.settings.askGroupToGroupJoinQuestions &&
        thisGroup.groupToGroupJoinQuestions &&
        thisGroup.groupToGroupJoinQuestions.map(q =>
          <div className={classes.answer} key={q.id}>
            <div className={classes.subtitle}>{q.text}</div>
            <p>{get('answer', questionAnswers && questionAnswers.find(qa => qa.question.id === q.questionId)) || <i>{t('Not answered')}</i>}</p>
          </div>
        )}
        {otherAnswers.map(qa =>
          <div className={classes.answer} key={qa.id}>
            <div className={classes.subtitle}>{qa.question.text}</div>
            <p>{qa.answer}</p>
          </div>
        )}
      </div>}
    </div>
  )
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

  return (
    <>
      <div className={classes.requestModalBg}>
        <div className={classes.requestModal}>
          <div className={classes.requestTop}>
            <span className={cx(classes.modalCloseButton)} onClick={hideRequestToJoinModal}><Icon name='Ex' /></span>
            <span className={classes.requestMessage}>{t('You are requesting that')}{' '}<strong>{group.name}</strong>{' '}{t('become a member of')}{' '}<strong>{parentGroup.name}</strong></span>
            <div className={classes.joinExample}>
              <div className={cx(classes.requestingGroup)} style={bgImageStyle(group.bannerUrl)}>
                <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} className={cx(classes.groupImage)} size='30px' square />
                <h4>{group.name}</h4>
              </div>
              <div className={classes.requestingIcon}>
                <Icon name='Handshake' />
              </div>
              <div className={cx(classes.requestedParentGroup)} style={bgImageStyle(parentGroup.bannerUrl)}>
                <RoundImage url={parentGroup.avatarUrl || DEFAULT_AVATAR} className={cx(classes.groupImage)} size='30px' square />
                <h4>{parentGroup.name}</h4>
              </div>
            </div>
          </div>
          {questionAnswers && <div className={classes.joinQuestions}>
            <div className={classes.requestMessageTitle}>{t('{{parentGroup.name}} requires groups to answer the following questions before joining', { parentGroup })}</div>
            {questionAnswers.map((q, index) => <div className={classes.joinQuestion} key={index}>
              <div className={classes.subtitle}>{q.text}</div>
              <textarea name={`question_${q.questionId}`} onChange={setAnswer(index)} value={q.answer} placeholder={t('Type your answer here...')} />
            </div>)}
          </div>}
          <div className={classes.requestBottom}>
            <Button onClick={() => { requestToAddGroupToParent(parentGroup.id, group.id, questionAnswers); hideRequestToJoinModal() }}>{t('Request to Join')}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(RelatedGroupsTab)
