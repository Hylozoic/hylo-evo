import PropTypes from 'prop-types'
import React, { Component, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import KeyControlledItemList from 'components/KeyControlledList/KeyControlledItemList'
import RemovableListItem from 'components/RemovableListItem'
import Icon from 'components/Icon'
import { isEmpty, get, includes } from 'lodash/fp'
import { removeResponsibilityFromRole, addResponsibilityToRole, fetchResponsibilitiesForGroupRole, fetchResponsibilitiesForGroup, fetchResponsibilitiesForCommonRole } from 'store/actions/responsibilities'
import { keyMap } from 'util/textInput'
import { personUrl } from 'util/navigation'
import SettingsControl from 'components/SettingsControl'
import SettingsSection from '../SettingsSection'
import EmojiPicker from 'components/EmojiPicker'
import styles from './RolesSettingsTab.scss' // eslint-disable-line no-unused-vars

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

class RolesSettingsTab extends Component {
  static propTypes = {
    addGroupRole: func,
    addRoleToMember: func,
    commonRoles: array,
    group: object,
    removeRoleFromMember: func,
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
    this.props.clearStewardSuggestions()
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
      commonRoles,
      group = {},
      t
    } = this.props

    const {
      roles
    } = this.state

    const unsavedRolePresent = roles.length > 0 ? roles[roles.length - 1]?.active === '' : false

    return (
      <>
        <SettingsSection>
          <h3>{t('Common Roles')}</h3>
          <div styleName='styles.help-text'>{t('adminRolesHelpText')}</div>
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
          <h3>{t('Custom Roles & Badges')}</h3>
          <div styleName='styles.help-text'>{t('Create additional roles or badges for your group')}</div>
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

function RoleRowUntranslated ({
  active,
  addRoleToMember,
  changed,
  isCommonRole,
  clearStewardSuggestions,
  description,
  emoji,
  fetchStewardSuggestions,
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
  suggestions = [],
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
          <SettingsControl label='Description' controlClass={styles['settings-control']} onChange={onChange('description')} value={description} type='textarea' />
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
                {...{ addRoleToMember, suggestions, clearStewardSuggestions, fetchMembersForGroupRole, fetchMembersForCommonRole, fetchStewardSuggestions, removeRoleFromMember, active }}
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
    this.listRef = React.createRef()
    this.inputRef = React.createRef()
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
      if (!this.listRef.current) return
      return this.listRef.current.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (e.key === 'Escape') {
        toggle()
        return
      }
      if (!this.listRef.current) return
      return this.listRef.current.handleKeys(e)
    }

    const listWidth = { width: get('inputRef.current.clientWidth', this, 0) + 4 }

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
              ref={this.inputRef}
              data-testid='add-member-input'
            />
            <span styleName='styles.cancel-button' onClick={toggle}>{t('Cancel')}</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
          </div>
          {!isEmpty(memberSuggestions) && <div style={listWidth}>
            <KeyControlledItemList
              ref={this.listRef}
              items={memberSuggestions}
              onChange={onChoose}
              theme={styles}
            />
          </div>}
        </div>
      )
    } else {
      return (
        <div styleName='styles.add-new' onClick={toggle} data-testid='add-new'>
          + {t('Add Member to Role')}
        </div>
      )
    }
  }
}

export const AddMemberToRole = withTranslation()(AddMemberToRoleUntranslated)

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
    this.listRef = React.createRef()
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
      if (!this.listRef.current) return
      return this.listRef.current.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (e.key === 'Escape') {
        toggle()
        return
      }
      if (!this.listRef.current) return
      return this.listRef.current.handleKeys(e)
    }

    const listWidth = { width: get('inputRef.current.clientWidth', this, 0) + 4 }
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
              ref={this.inputRef}
            />
            <span styleName='styles.cancel-button' onClick={toggle}>{t('Cancel')}</span>
            <span styleName='styles.add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
          </div>
          {!isEmpty(responsibilitySuggestions) && <div style={listWidth}>
            <KeyControlledItemList
              ref={this.listRef}
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

export function RoleList ({ slug, fetchStewardSuggestions, addRoleToMember, suggestions, clearStewardSuggestions, roleId, fetchMembersForGroupRole, fetchMembersForCommonRole, removeRoleFromMember, group, isCommonRole, t }) {
  const [membersForRole, setMembersForRole] = useState([])
  const [responsibilitiesForRole, setResponsibilitiesForRole] = useState([])
  const [availableResponsibilities, setAvailableResponsibilities] = useState([])
  const dispatch = useDispatch()
  const memberFetcher = isCommonRole ? fetchMembersForCommonRole : fetchMembersForGroupRole
  const responsbilityFetcher = isCommonRole ? fetchResponsibilitiesForCommonRole : fetchResponsibilitiesForGroupRole

  useEffect(() => {
    memberFetcher({ roleId })
      .then((response) => setMembersForRole(response?.payload?.data?.group?.members?.items || []))
      .catch((e) => { console.error('Error fetching members for role ', e) })
  }, [])

  useEffect(() => {
    let isMounted = true
    dispatch(responsbilityFetcher({ roleId }))
      .then((response) => { if (isMounted) setResponsibilitiesForRole(response?.payload?.data?.responsibilities || []) })
      .catch((e) => { console.error('Error fetching responsibilities for role ', e) })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    dispatch(fetchResponsibilitiesForGroup({ groupId: group.id }))
      .then((response) => { if (isMounted) setAvailableResponsibilities(response?.payload?.data?.responsibilities || []) })
      .catch((e) => { console.error('Error fetching responsibilities for group', e) })
    return () => { isMounted = false }
  }, [])

  const memberRoleIds = membersForRole.map(mr => mr.id)

  const memberSuggestions = suggestions.filter(person => !includes(person.id, memberRoleIds))

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
        <h4>Responsibilities</h4>
        {isCommonRole && (
          <div styleName='styles.help-text'>{t('Common roles cannot have their responsibilities edited')}</div>
        )}
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
      <div style={{ marginTop: '20px' }}>
        <h4>Members</h4>
        {membersForRole.map(m =>
          <RemovableListItem
            item={m}
            url={personUrl(m.id, slug)}
            removeItem={handleRemoveRoleFromMember}
            key={m.id}
          />)}
      </div>
      <AddMemberToRole
        fetchSuggestions={fetchStewardSuggestions}
        addRoleToMember={addRoleToMember}
        memberSuggestions={memberSuggestions}
        clearSuggestions={clearStewardSuggestions}
        updateLocalMembersForRole={updateLocalMembersForRole}
        roleId={roleId}
        isCommonRole={isCommonRole}
      />
    </div>
  )
}

export default withTranslation()(RolesSettingsTab)
