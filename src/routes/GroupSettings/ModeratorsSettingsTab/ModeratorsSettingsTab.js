import PropTypes from 'prop-types'
import React, { Component, useEffect, useRef, useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import Loading from 'components/Loading'
import KeyControlledItemList from 'components/KeyControlledList/KeyControlledItemList'
import RemovableListItem from 'components/RemovableListItem'
import Icon from 'components/Icon'
import { isEmpty, get, includes } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import { personUrl } from 'util/navigation'
import SettingsControl from 'components/SettingsControl'
import SettingsSection from '../SettingsSection'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'
import EmojiPicker from 'components/EmojiPicker'
import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './ModeratorsSettingsTab.scss' // eslint-disable-line no-unused-vars

const { array, func, string, object } = PropTypes

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
    if (window.confirm('Are you sure you want to delete this unsaved role/badge?')) { // TODO: i18n
      const newRoles = [...this.state.roles]
      newRoles.splice(i, 1)
      this.setState({
        roles: newRoles
      })
    }
  }

  toggleRoleActivation = (i) => () => {
    const roles = [...this.state.roles]
    const role = roles[i]
    if (window.confirm(`Are you sure you want to ${role.active ? 'deactivate' : 'reactivate'} this role/badge?`)) { // TODO: i18n
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
    const role = { ...this.state.roles[i] }
    if (validateRole(role)) {
      this.props.addGroupRole({ ...role, groupId: this.props?.group?.id }).then((response) => {
        const roles = this.state.roles
        roles[i] = { ...response.payload.data.addGroupRole }
        this.setState({ roles })
      })
    } else {
      window.alert('A role must have a valid emoji and name to be saved') // TODO: i18n
    }
  }

  resetRole = (i) => () => {
    const role = { ...this.state.roles[i] }
    const roles = [...this.state.roles]
    roles[i] = { ...role.originalState }
    this.setState({ roles })
  }

  updateRole = (i) => () => {
    const role = { ...this.state.roles[i] }
    if (validateRole(role)) {
      this.props.updateGroupRole({ ...role, groupId: this.props?.group?.id, groupRoleId: role.id }).then((response) => {
        const roles = this.state.roles
        roles[i] = { ...response.payload.data.updateGroupRole }
        this.setState({ roles })
      })
    } else {
      window.alert('A role must have a valid emoji and name to be updated') // TODO: i18n
    }
  }

  render () {
    const {
      moderators,
      group = {}
    } = this.props

    const {
      modalVisible,
      isRemoveFromGroup,
      roles
    } = this.state

    const unsavedRolePresent = roles.length > 0 ? roles[roles.length - 1]?.active === '' : false
    if (!moderators) return <Loading />

    return (
      <>
        <SettingsSection>
          <h3>
            {group?.moderatorDescriptorPlural || 'Moderators'}
            <div styleName='styles.help-text'>Who has access to group settings and moderation powers</div>
            {/* TODO i18n */}
          </h3>
          <ModeratorsList key='mList' {...this.props} removeItem={(id) => this.setState({ modalVisible: true, moderatorToRemove: id })} />
          {modalVisible && <ModalDialog
            key='remove-moderator-dialog'
            closeModal={() => this.setState({ modalVisible: false })}
            showModalTitle={false}
            submitButtonAction={this.submitRemoveModerator}
            submitButtonText={this.props.t('Remove')}>
            <div styleName='styles.content'>
              <div styleName='styles.modal-text'>{this.props.t('Are you sure you wish to remove this moderator?')}</div>
              <CheckBox checked={isRemoveFromGroup} label={this.props.t('Remove from group as well')} onChange={value => this.setState({ isRemoveFromGroup: value })} />
            </div>
          </ModalDialog>}
        </SettingsSection>
        <SettingsSection>
          <h3>Other Roles &amp; Badges</h3>
          <div styleName='styles.help-text'>Create additional roles or badges for the group</div>
          {/* TODO: i18n */}
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
              <h4>Create new role/badge</h4>
              {/* TODO: i18n */}
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

function RoleRow ({
  active,
  addRoleToMember,
  changed,
  clearModeratorSuggestions,
  description,
  emoji,
  fetchModeratorSuggestions,
  fetchMembersForGroupRole,
  group,
  id,
  name,
  onChange,
  onDelete,
  onToggleActivation,
  onReset,
  onSave,
  onUpdate,
  index,
  rawSuggestions = [],
  removeRoleFromMember
}) {
  const isDraftRole = active === ''
  const inactiveStyle = (!active && !isDraftRole) ? 'styles.inactive' : ''
  return (
    <div styleName={`styles.role-container ${inactiveStyle}`}>
      <div styleName='styles.action-container'>
        {isDraftRole && (<span onClick={onDelete} styleName='styles.action'><Icon name='Trash' /> Delete</span>)}
        {!isDraftRole && changed && (<span styleName='styles.action' onClick={onUpdate}><Icon name='Unlock' /> Save</span>)}
        {!isDraftRole && changed && (<span styleName='styles.action' onClick={onReset}><Icon name='Back' /> Revert</span>)}
        {!isDraftRole && !changed && (<span styleName='styles.action' onClick={onToggleActivation}><Icon name={active ? 'CircleEx' : 'CircleArrow'} /> {active ? 'Deactivate' : 'Reactivate'}</span>)}
        {/* TODO: i18n */}
      </div>
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
              <div styleName='styles.create-button' onClick={onSave}>Create Role</div>
            </div>
          )
          : active && (
            <SettingsSection>
              <GroupRoleList
                {...{ addRoleToMember, rawSuggestions, clearModeratorSuggestions, fetchMembersForGroupRole, fetchModeratorSuggestions, removeRoleFromMember }}
                key='grList'
                groupRoleId={id}
                slug={group.slug}
              />
            </SettingsSection>
          )
      }
    </div>
  )
}

export class AddMemberToRole extends Component {
  static propTypes = {
    addRoleToMember: func,
    clearSuggestions: func,
    fetchSuggestions: func,
    groupRoleId: string,
    memberSuggestions: array,
    updateLocalMembersForRole: func
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: false
    }
  }

  render () {
    const { fetchSuggestions, addRoleToMember, memberSuggestions, clearSuggestions, groupRoleId, updateLocalMembersForRole } = this.props

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
      addRoleToMember({ personId: choice.id, groupRoleId }).then(() => {
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
          <div styleName='styles.help-text'>Search here for members to grant this role too</div>
          {/* TODO: i18n */}
          <div styleName='styles.input-row'>
            <input
              styleName='styles.input'
              placeholder='Type...'
              type='text'
              onChange={onInputChange}
              onKeyDown={handleKeys}
              ref='input'
            />
            <span styleName='styles.cancel-button' onClick={toggle}>Cancel</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>Add</span>
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
      // TODO: i18n
      return (
        <div styleName='styles.add-new' onClick={toggle}>
          + Add Member to Role
        </div>
      )
    }
  }
}

export function GroupRoleList ({ slug, removeItem, fetchModeratorSuggestions, addRoleToMember, rawSuggestions, clearModeratorSuggestions, groupRoleId, fetchMembersForGroupRole, removeRoleFromMember }) {
  const [membersForRole, setMembersForRole] = useState([])

  useEffect(() => {
    fetchMembersForGroupRole({ groupRoleId })
      .then((response) => {
        setMembersForRole(response.payload.data.group.members.items)
      })
  }, [])

  const memberRoleIds = membersForRole.map(mr => mr.id)

  const memberSuggestions = rawSuggestions.filter(person => !includes(person.id, memberRoleIds))

  const updateLocalMembersForRole = (choice) => {
    const updatedMembers = [...membersForRole, choice]
    setMembersForRole(updatedMembers)
  }

  const handleRemoveRoleFromMember = (id) => {
    removeRoleFromMember({ personId: id, groupRoleId }).then(() => {
      const updatedMembers = membersForRole.filter(member => member.id !== id)
      setMembersForRole(updatedMembers)
    })
  }

  return (
    <div>
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
        groupRoleId={groupRoleId}
      />
    </div>
  )
}

export default withTranslation()(ModeratorsSettingsTab)
