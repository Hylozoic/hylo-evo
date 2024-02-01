import PropTypes from 'prop-types'
import React, { Component, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Loading from 'components/Loading'
import KeyControlledItemList from 'components/KeyControlledList/KeyControlledItemList'
import RemovableListItem from 'components/RemovableListItem'
import Icon from 'components/Icon'
import { isEmpty, get, includes } from 'lodash/fp'
import { removeResponsibilityFromRole, addResponsibilityToRole, fetchResponsibilitiesForGroupRole, fetchResponsibilitiesForGroup, fetchResponsibilitiesForCommonRole } from 'store/actions/responsibilities'
import { getKeyCode, keyMap } from 'util/textInput'
import { personUrl } from 'util/navigation'
import SettingsControl from 'components/SettingsControl'
import SettingsSection from '../SettingsSection'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'
import EmojiPicker from 'components/EmojiPicker'
import styles from './ModeratorsSettingsTab.scss' // eslint-disable-line no-unused-vars

const { array, func, string, object, bool } = PropTypes

const emptyRole = {
  color: '',
  description: '',
  emoji: '',
  name: '',
  active: ''
}

const validateRole = ({ name, emoji }) => {
  if (name.length < 3) return false
  if (emoji === '') return false
  return true
}

class ModeratorsSettingsTab extends Component {
  static propTypes = {
    addModerator: func,
    addGroupRole: func,
    addRoleToMember: func,
    group: object,
    moderators: array,
    removeModerator: func,
    removeRoleFromMember: func,
    roles: array,
    slug: string,
    updateGroupRole: func
  }

  constructor (props) {
    super(props)
    this.state = this.defaultEditState()
  }

  state = {
    modalVisible: false
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.group?.groupRoles && this.props.group?.groupRoles) {
      this.setState(this.defaultEditState())
    }
  }

  componentWillUnmount () {
    this.props.clearModeratorSuggestions()
  }

  defaultEditState () {
    const { group } = this.props

    if (!group) return { roles: [], valid: false }

    const roles = group?.groupRoles?.items

    return {
      roles: roles || [],
      error: null,
      modalVisible: false
    }
  }

  submitRemoveModerator = () => {
    this.props.removeModerator(this.state.moderatorToRemove, this.state.isRemoveFromGroup)
  }

  handleAddRole = () => {
    this.setState({
      roles: [...this.state.roles].concat({ ...emptyRole })
    })
  }

  deleteUnsavedRole = (i) => () => {
    const { t } = this.props
    if (window.confirm(t('Are you sure you want to delete this unsaved role/badge?'))) {
      const newRoles = [...this.state.roles]
      newRoles.splice(i, 1)
      this.setState({
        roles: newRoles
      })
    }
  }

  toggleRoleActivation = (i) => () => {
    const { t } = this.props
    const roles = [...this.state.roles]
    const role = roles[i]
    if (window.confirm(`${t('Are you sure you want to ')}${role.active ? t('deactivate') : t('reactivate')} ${t('this role/badge?')}`)) {
      this.props.updateGroupRole({ active: !role.active, groupId: this.props?.group?.id, groupRoleId: role.id }).then((response) => {
        roles[i] = { ...response.payload.data.updateGroupRole }
        this.setState({ roles })
      })
    }
  }

  updateLocalRole = (i) => (key) => (v) => {
    const value = typeof (v.target) !== 'undefined' ? v.target.value : v
    const role = { ...this.state.roles[i] }
    if (role.changed !== true) role.originalState = { ...role }
    role[key] = value
    role.changed = true
    const roles = [...this.state.roles]
    roles[i] = role
    this.setState({ roles })
  }

  saveRole = (i) => () => {
    const { t } = this.props
    const role = { ...this.state.roles[i] }
    if (validateRole(role)) {
      this.props.addGroupRole({ ...role, groupId: this.props?.group?.id }).then((response) => {
        const roles = this.state.roles
        roles[i] = { ...response.payload.data.addGroupRole }
        this.setState({ roles })
      })
    } else {
      window.alert(t('A role must have a valid emoji and name to be saved'))
    }
  }

  resetRole = (i) => () => {
    const role = { ...this.state.roles[i] }
    const roles = [...this.state.roles]
    roles[i] = { ...role.originalState }
    this.setState({ roles })
  }

  updateRole = (i) => () => {
    const { t } = this.props
    const role = { ...this.state.roles[i] }
    if (validateRole(role)) {
      this.props.updateGroupRole({ ...role, groupId: this.props?.group?.id, groupRoleId: role.id }).then((response) => {
        const roles = this.state.roles
        roles[i] = { ...response.payload.data.updateGroupRole }
        this.setState({ roles })
      })
    } else {
      window.alert(t('A role must have a valid emoji and name to be updated'))
    }
  }

  render () {
    const {
      moderators,
      group = {},
      t
    } = this.props

    const {
      modalVisible,
      isRemoveFromGroup,
      roles
    } = this.state

    const { commonRoles = [] } = group

    const unsavedRolePresent = roles.length > 0 ? roles[roles.length - 1]?.active === '' : false
    if (!moderators) return <Loading />

    return (
      <>
        {/* TODO RESP: Remove this whole section once the moderators are ported to common-role-managers via data migration */}
        <SettingsSection>
          <h3>
            {group?.moderatorDescriptorPlural || t('Moderators')}
            <div styleName='styles.help-text'>{t('Who has access to group settings and moderation powers')}</div>
          </h3>
          <ModeratorsList key='mList' {...this.props} removeItem={(id) => this.setState({ modalVisible: true, moderatorToRemove: id })} />
          {modalVisible &&
            <ModalDialog
              key='remove-moderator-dialog'
              closeModal={() => this.setState({ modalVisible: false })}
              showModalTitle={false}
              submitButtonAction={this.submitRemoveModerator}
              submitButtonText={this.props.t('Remove')}
            >
              <div styleName='styles.content'>
                <div styleName='styles.modal-text'>{this.props.t('Are you sure you wish to remove this moderator?')}</div>
                <CheckBox checked={isRemoveFromGroup} label={this.props.t('Remove from group as well')} onChange={value => this.setState({ isRemoveFromGroup: value })} />
              </div>
            </ModalDialog>}
        </SettingsSection>
        <SettingsSection>
          <h3>{t('Common Roles & Badges')}</h3>
          <div styleName='styles.help-text'>{t('Use common roles or badges for the group')}</div>
          {commonRoles.map((role, i) => (
            <RoleRow
              {...this.props}
              group={group}
              key={i}
              index={i}
              {...role}
              isCommonRole
            />
          ))}
        </SettingsSection>
        <SettingsSection>
          <h3>{t('Other Roles & Badges')}</h3>
          <div styleName='styles.help-text'>{t('Create additional roles or badges for the group')}</div>
          {roles.map((role, i) => (
            <RoleRow
              {...this.props}
              group={group}
              key={i}
              index={i}
              {...role}
              onChange={this.updateLocalRole(i)}
              onSave={this.saveRole(i)}
              onUpdate={this.updateRole(i)}
              onToggleActivation={this.toggleRoleActivation(i)}
              onDelete={this.deleteUnsavedRole(i)}
              onReset={this.resetRole(i)}
            />
          ))}
          {!unsavedRolePresent && (
            <div styleName='styles.add-role' onClick={this.handleAddRole}>
              <h4>{t('Create new role/badge')}</h4>
              <Icon name='Circle-Plus' styleName='styles.new-role' />
            </div>
          )}
        </SettingsSection>
        <br />
      </>
    )
  }
}

export function ModeratorsList ({ moderators, slug, removeItem, fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions }) {
  return (
    <div>
      <div>
        {moderators.map(m =>
          <RemovableListItem
            item={m}
            url={personUrl(m.id, slug)}
            skipConfirm
            removeItem={removeItem}
            key={m.id}
          />)}
      </div>
      <AddModerator
        fetchModeratorSuggestions={fetchModeratorSuggestions}
        addModerator={addModerator}
        moderatorSuggestions={moderatorSuggestions}
        clearModeratorSuggestions={clearModeratorSuggestions}
      />
    </div>
  )
}

class AddModeratorUntranslated extends Component {
  static propTypes = {
    addModerator: func,
    fetchModeratorSuggestions: func
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: false
    }
  }

  render () {
    const { fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions, t } = this.props

    const { adding } = this.state

    const toggle = () => {
      this.setState({ adding: !adding })
    }

    const onInputChange = e => {
      if (e.target.value.length === 0) return clearModeratorSuggestions()
      return fetchModeratorSuggestions(e.target.value)
    }

    const onChoose = choice => {
      addModerator(choice.id)
      clearModeratorSuggestions()
      toggle()
    }

    const chooseCurrentItem = () => {
      if (!this.refs.list) return
      return this.refs.list.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (getKeyCode(e) === keyMap.ESC) {
        toggle()
        return clearModeratorSuggestions()
      }
      if (!this.refs.list) return
      return this.refs.list.handleKeys(e)
    }

    const listWidth = { width: get('refs.input.clientWidth', this, 0) + 4 }

    if (adding) {
      return (
        <div styleName='styles.adding'>
          <div styleName='styles.help-text'>{t('Search here for members to grant moderator powers')}</div>
          <div styleName='styles.input-row'>
            <input
              styleName='styles.input'
              placeholder={t('Type...')}
              type='text'
              onChange={onInputChange}
              onKeyDown={handleKeys}
              ref='input'
            />
            <span styleName='styles.cancel-button' onClick={toggle}>{t('Cancel')}</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
          </div>
          {!isEmpty(moderatorSuggestions) && <div style={listWidth}>
            <KeyControlledItemList
              ref='list'
              items={moderatorSuggestions}
              onChange={onChoose}
              theme={styles}
            />
          </div>}
        </div>
      )
    } else {
      return (
        <div styleName='styles.add-new' id='add-new' onClick={toggle}>
          + {t('Add New')}
        </div>
      )
    }
  }
}

export const AddModerator = withTranslation()(AddModeratorUntranslated)

function RoleRowUntranslated ({
  active,
  addRoleToMember,
  changed,
  isCommonRole,
  clearModeratorSuggestions,
  description,
  emoji,
  fetchModeratorSuggestions,
  fetchMembersForGroupRole,
  fetchMembersForCommonRole,
  group,
  id,
  name,
  onChange = () => {},
  onDelete,
  onToggleActivation,
  onReset,
  onSave,
  onUpdate,
  index,
  rawSuggestions = [],
  removeRoleFromMember,
  t
}) {
  const isDraftRole = active === ''
  const inactiveStyle = (!active && !isDraftRole && !isCommonRole) ? 'styles.inactive' : ''
  return (
    <div styleName={`styles.role-container ${inactiveStyle}`}>
      {!isCommonRole &&
        <div styleName='styles.action-container'>
          {isDraftRole && (<span onClick={onDelete} styleName='styles.action'><Icon name='Trash' /> {t('Delete')}</span>)}
          {!isDraftRole && changed && (<span styleName='styles.action' onClick={onUpdate}><Icon name='Unlock' /> {t('Save')}</span>)}
          {!isDraftRole && changed && (<span styleName='styles.action' onClick={onReset}><Icon name='Back' /> {t('Revert')}</span>)}
          {!isDraftRole && !changed && (<span styleName='styles.action' onClick={onToggleActivation}><Icon name={active ? 'CircleEx' : 'CircleArrow'} /> {active ? t('Deactivate') : t('Reactivate')}</span>)}
        </div>}
      <div styleName='styles.role-row'>
        <EmojiPicker forReactions={false} emoji={emoji} handleReaction={onChange('emoji')} className={styles['emoji-picker']} />
        <div styleName='styles.role-stack'>
          <SettingsControl label='Name' controlClass={styles['settings-control']} onChange={onChange('name')} value={name} />
          <SettingsControl label='Description' controlClass={styles['settings-control']} onChange={onChange('description')} value={description} />
        </div>
      </div>
      {
        isDraftRole
          ? (
            <div styleName='styles.role-row styles.reverse-flex'>
              <div styleName='styles.create-button' onClick={onSave}>{t('Create Role')}</div>
            </div>
          )
          : (active || isCommonRole) && (
            <SettingsSection>
              <RoleList
                {...{ addRoleToMember, rawSuggestions, clearModeratorSuggestions, fetchMembersForGroupRole, fetchMembersForCommonRole, fetchModeratorSuggestions, removeRoleFromMember, active }}
                key='grList'
                group={group}
                isCommonRole={isCommonRole}
                roleId={id}
                t={t}
                slug={group.slug}
              />
            </SettingsSection>
          )
      }
    </div>
  )
}

const RoleRow = withTranslation()(RoleRowUntranslated)

class AddMemberToRoleUntranslated extends Component {
  static propTypes = {
    addRoleToMember: func,
    clearSuggestions: func,
    fetchSuggestions: func,
    roleId: string,
    memberSuggestions: array,
    updateLocalMembersForRole: func,
    isCommonRole: bool
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: false
    }
  }

  render () {
    const { fetchSuggestions, addRoleToMember, memberSuggestions, clearSuggestions, roleId, updateLocalMembersForRole, isCommonRole = false, t } = this.props

    const { adding } = this.state

    const toggle = () => {
      clearSuggestions()
      this.setState({ adding: !adding })
    }

    const onInputChange = e => {
      if (e.target.value.length === 0) return clearSuggestions()
      return fetchSuggestions(e.target.value)
    }

    const onChoose = choice => {
      addRoleToMember({ personId: choice.id, roleId, isCommonRole }).then(() => {
        updateLocalMembersForRole(choice)
      })
      toggle()
    }

    const chooseCurrentItem = () => {
      if (!this.refs.list) return
      return this.refs.list.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (getKeyCode(e) === keyMap.ESC) {
        toggle()
        return
      }
      if (!this.refs.list) return
      return this.refs.list.handleKeys(e)
    }

    const listWidth = { width: get('refs.input.clientWidth', this, 0) + 4 }

    if (adding) {
      return (
        <div styleName='styles.adding'>
          <div styleName='styles.help-text'>{t('Search here for members to grant this role too')}</div>
          <div styleName='styles.input-row'>
            <input
              styleName='styles.input'
              placeholder='Type...'
              type='text'
              onChange={onInputChange}
              onKeyDown={handleKeys}
              ref='input'
            />
            <span styleName='styles.cancel-button' onClick={toggle}>{t('Cancel')}</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
          </div>
          {!isEmpty(memberSuggestions) && <div style={listWidth}>
            <KeyControlledItemList
              ref='list'
              items={memberSuggestions}
              onChange={onChoose}
              theme={styles}
            />
          </div>}
        </div>
      )
    } else {
      return (
        <div styleName='styles.add-new' onClick={toggle}>
          + {t('Add Member to Role')}
        </div>
      )
    }
  }
}

const AddMemberToRole = withTranslation()(AddMemberToRoleUntranslated)

class AddResponsibilityToRoleUntranslated extends Component {
  static propTypes = {
    addResponsibilityToRole: func,
    roleId: string,
    responsibilitySuggestions: array
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: false
    }
  }

  render () {
    const { addResponsibilityToRole, responsibilitySuggestions, roleId, group, t } = this.props

    const { adding } = this.state

    const toggle = () => {
      this.setState({ adding: !adding })
    }

    const onChoose = choice => {
      addResponsibilityToRole({ responsibilityId: choice.id, roleId, groupId: group.id, responsibility: choice })
      toggle()
    }

    const chooseCurrentItem = () => {
      if (!this.refs.list) return
      return this.refs.list.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (getKeyCode(e) === keyMap.ESC) {
        toggle()
        return
      }
      if (!this.refs.list) return
      return this.refs.list.handleKeys(e)
    }

    const listWidth = { width: get('refs.input.clientWidth', this, 0) + 4 }
    if (adding) {
      return (
        <div styleName='styles.adding'>
          <div styleName='styles.help-text'>{t('Search here for responsibilities to add to this role')}</div>
          <div styleName='styles.input-row'>
            <input
              styleName='styles.input'
              placeholder='Type...'
              type='text'
              onKeyDown={handleKeys}
              ref='input'
            />
            <span styleName='styles.cancel-button' onClick={toggle}>{t('Cancel')}</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
          </div>
          {!isEmpty(responsibilitySuggestions) && <div style={listWidth}>
            <KeyControlledItemList
              ref='list'
              items={responsibilitySuggestions}
              onChange={onChoose}
              theme={styles}
            />
          </div>}
        </div>
      )
    } else {
      return (
        <div styleName='styles.add-new' onClick={toggle}>
          + {t('Add Responsibility to Role')}
        </div>
      )
    }
  }
}

const AddResponsibilityToRole = withTranslation()(AddResponsibilityToRoleUntranslated)

export function RoleList ({ slug, fetchModeratorSuggestions, addRoleToMember, rawSuggestions, clearModeratorSuggestions, roleId, fetchMembersForGroupRole, fetchMembersForCommonRole, removeRoleFromMember, group, isCommonRole, t }) {
  const [membersForRole, setMembersForRole] = useState([])
  const [responsibilitiesForRole, setResponsibilitiesForRole] = useState([])
  const [availableResponsibilities, setAvailableResponsibilities] = useState([])
  const dispatch = useDispatch()
  const memberFetcher = isCommonRole ? fetchMembersForCommonRole : fetchMembersForGroupRole
  const responsbilityFetcher = isCommonRole ? fetchResponsibilitiesForCommonRole : fetchResponsibilitiesForGroupRole

  useEffect(() => {
    memberFetcher({ roleId })
      .then((response) => setMembersForRole(response.payload.data.group.members.items))
  }, [])

  useEffect(() => {
    dispatch(responsbilityFetcher({ roleId }))
      .then((response) => setResponsibilitiesForRole(response.payload.data.responsibilities))
  }, [])

  useEffect(() => {
    dispatch(fetchResponsibilitiesForGroup({ groupId: group.id }))
      .then((response) => setAvailableResponsibilities(response.payload.data.responsibilities))
  }, [])

  const memberRoleIds = membersForRole.map(mr => mr.id)

  const memberSuggestions = rawSuggestions.filter(person => !includes(person.id, memberRoleIds))

  const groupRoleResponsibilityTitles = responsibilitiesForRole.map(rfr => rfr.title)
  // TODO: dubious. Need to ensure the above returns responsibilityIds and then change the below off title
  const responsibilitySuggestions = availableResponsibilities.filter(responsibility => !includes(responsibility.title, groupRoleResponsibilityTitles))

  const updateLocalMembersForRole = (choice) => {
    const updatedMembers = [...membersForRole, choice]
    setMembersForRole(updatedMembers)
  }

  const updateLocalResponsibilitiesForRole = (choice) => {
    const updatedResponsibilities = [...responsibilitiesForRole, choice]
    setResponsibilitiesForRole(updatedResponsibilities)
  }

  const handleRemoveRoleFromMember = (id) => {
    dispatch(removeRoleFromMember({ personId: id, roleId, isCommonRole })).then(() => {
      const updatedMembers = membersForRole.filter(member => member.id !== id)
      setMembersForRole(updatedMembers)
    })
  }

  const handleRemoveResponsibilityFromRole = (id) => {
    dispatch(removeResponsibilityFromRole({ roleResponsibilityId: id, groupId: group.id })).then(() => {
      const updatedResponsibilities = responsibilitiesForRole.filter(responsibility => responsibility.id !== id)
      setResponsibilitiesForRole(updatedResponsibilities)
    })
  }

  const handleAddResponsibilityToRole = ({ responsibilityId, roleId, groupId, responsibility }) => {
    dispatch(addResponsibilityToRole({ responsibilityId, roleId, groupId })).then((response) => {
      const updatedResponsibilities = [...responsibilitiesForRole, { ...responsibility, id: response.payload.data.addResponsibilityToRole.id, responsibilityId: responsibility.id }]
      setResponsibilitiesForRole(updatedResponsibilities)
    })
  }

  return (
    <div>
      <div>
        {responsibilitiesForRole.map(r =>
          <RemovableListItem
            item={r}
            removeItem={isCommonRole ? null : handleRemoveResponsibilityFromRole}
            key={r.id}
          />)}
      </div>
      {!isCommonRole && (
        <AddResponsibilityToRole
          fetchSuggestions={() => dispatch(fetchResponsibilitiesForGroup({ groupId: group.id }))}
          addResponsibilityToRole={handleAddResponsibilityToRole}
          responsibilitySuggestions={responsibilitySuggestions}
          updateLocalResponsibilitiesForRole={updateLocalResponsibilitiesForRole}
          roleId={roleId}
          group={group}
        />)}
      {isCommonRole && (
        <div styleName='styles.help-text'>{t('Common roles cannot have their responsibilities edited')}</div>
      )}
      <div>
        {membersForRole.map(m =>
          <RemovableListItem
            item={m}
            url={personUrl(m.id, slug)}
            removeItem={handleRemoveRoleFromMember}
            key={m.id}
          />)}
      </div>
      <AddMemberToRole
        fetchSuggestions={fetchModeratorSuggestions}
        addRoleToMember={addRoleToMember}
        memberSuggestions={memberSuggestions}
        clearSuggestions={clearModeratorSuggestions}
        updateLocalMembersForRole={updateLocalMembersForRole}
        roleId={roleId}
        isCommonRole={isCommonRole}
      />
    </div>
  )
}

export default withTranslation()(ModeratorsSettingsTab)
