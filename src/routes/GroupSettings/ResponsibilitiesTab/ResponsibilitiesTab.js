import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import SettingsControl from 'components/SettingsControl'
import { fetchResponsibilitiesForGroup, addGroupResponsibility, deleteGroupResponsibility, updateGroupResponsibility } from 'store/actions/responsibilities'
import SettingsSection from '../SettingsSection'
import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './ResponsibilitiesTab.scss' // eslint-disable-line no-unused-vars

const emptyResponsiblity = {
  description: '',
  title: '',
  draft: true,
  type: 'group'
}

const validateResponsibility = ({ title }) => {
  if (title.length < 3) return false
  return true
}

export default function ResponsibilitiesTab ({ group }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [responsibilities, setResponsibilities] = useState([])

  useEffect(() => {
    dispatch(fetchResponsibilitiesForGroup({ groupId: group.id }))
      .then((response) => {
        setResponsibilities(response.payload.data.responsibilities)
      })
  }, [])

  const handleAddResponsibility = () => {
    responsibilities.push({ ...emptyResponsiblity })
    setResponsibilities([...responsibilities])
  }

  const deleteUnsavedResponsibility = (i) => () => {
    if (window.confirm(t('Are you sure you want to delete this responsibility?'))) {
      const newResponsiblities = [...responsibilities]
      newResponsiblities.splice(i, 1)
      setResponsibilities(newResponsiblities)
    }
  }

  const deleteSavedResponsibility = (i) => () => {
    const newResponsbilities = [...responsibilities]
    const responsbility = { ...newResponsbilities[i] }
    if (window.confirm(`${t('Are you sure you want to delete this responsibility?')}`)) {
      dispatch(deleteGroupResponsibility({ groupId: group?.id, responsibilityId: responsbility.id })).then((response) => {
        newResponsbilities.splice(i, 1)
        setResponsibilities(newResponsbilities)
      })
    }
  }

  const updateLocalResponsibility = (i) => (key) => (v) => {
    const value = typeof (v.target) !== 'undefined' ? v.target.value : v
    const responsbility = { ...responsibilities[i] }
    if (responsbility.changed !== true) responsbility.originalState = { ...responsbility }
    responsbility[key] = value
    responsbility.changed = true
    const newResponsbilities = [...responsibilities]
    newResponsbilities[i] = responsbility
    setResponsibilities(newResponsbilities)
  }

  const saveResponsibility = (i) => () => {
    const responsbility = { ...responsibilities[i] }
    if (validateResponsibility(responsbility)) {
      dispatch(addGroupResponsibility({ ...responsbility, groupId: group?.id })).then((response) => {
        const newResponsbilities = [...responsibilities]
        newResponsbilities[i] = { ...response.payload.data.addGroupResponsibility }
        setResponsibilities(newResponsbilities)
      })
    } else {
      window.alert(t('A responsibility must have a title over three characters long to be saved'))
    }
  }

  const resetResponsibility = (i) => () => {
    const responsbility = { ...responsibilities[i] }
    const newResponsbilities = [...responsibilities]
    newResponsbilities[i] = { ...responsbility.originalState }
    setResponsibilities(newResponsbilities)
  }

  const updateResponsibility = (i) => () => {
    const responsbility = { ...responsibilities[i] }
    if (validateResponsibility(responsbility)) {
      dispatch(updateGroupResponsibility({ ...responsbility, groupId: group?.id, responsibilityId: responsbility.id })).then((response) => {
        const newResponsbilities = [...responsibilities]
        newResponsbilities[i] = { ...response.payload.data.updateGroupResponsibility }
        setResponsibilities(newResponsbilities)
      })
    } else {
      window.alert(t('A responsibility must have at least three characters for its title'))
    }
  }

  const unsavedRolePresent = responsibilities.length > 0 ? responsibilities[responsibilities.length - 1]?.draft : false

  if (!responsibilities) return <Loading />

  return (
    <>
      <h1>{t('Responsibilities and permissions')}</h1>
      <h2>{t('Platform Responsibilities')}</h2>
      {/* Is this i18n weirdly busted? */}
      <span styleName='styles.description'>{t('adminResponsibilitiesHelpText')}</span>
      <SettingsSection>
        {/* <div styleName='styles.help-text'>{t('Each of these responsibilities gives access to specific functionality related to the platform')}</div> */}
        {responsibilities && responsibilities.map((role, i) => (
          <ResponsibilityRow
            group={group}
            key={i}
            index={i}
            t={t}
            {...role}
            showType='system'
          />
        ))}
      </SettingsSection>
      <h4>{t('Custom Responsibilities')}</h4>
      <span styleName='styles.description'>{t('adminResponsibilitiesCustomHelpText')}</span>
      <SettingsSection>
        {responsibilities && responsibilities.map((role, i) => (
          <ResponsibilityRow
            group={group}
            key={i}
            index={i}
            t={t}
            {...role}
            showType='group'
            onChange={updateLocalResponsibility(i)}
            onSave={saveResponsibility(i)}
            onUpdate={updateResponsibility(i)}
            onDelete={deleteUnsavedResponsibility(i)}
            onServerDelete={deleteSavedResponsibility(i)}
            onReset={resetResponsibility(i)}
          />
        ))}
        {!unsavedRolePresent && (
          <div styleName='styles.add-role' onClick={handleAddResponsibility}>
            <h4>{t('Create new responsibility')}</h4>
            <Icon name='Circle-Plus' styleName='styles.new-role' />
          </div>
        )}
      </SettingsSection>
    </>
  )
}

function ResponsibilityRow ({
  changed,
  draft = false,
  description,
  title,
  onChange,
  onDelete,
  onServerDelete,
  onReset,
  onSave,
  onUpdate,
  showType,
  type,
  t
}) {
  const inactiveStyle = (draft) ? 'styles.inactive' : ''
  if (showType !== type) return null
  return (
    <div styleName={`styles.responsibility-container ${inactiveStyle}`}>
      <div styleName='styles.action-container'>
        {draft && (<span onClick={onDelete} styleName='styles.action'><Icon name='CircleEx' /> {t('Cancel')}</span>)}
        {!draft && type !== 'system' && !changed && (<span styleName='styles.action' onClick={onServerDelete}><Icon name='Trash' /> {t('Delete')}</span>)}
        {draft && <span styleName='styles.action' onClick={onSave}><Icon name='Plus' /> {t('Create')}</span>}
        {!draft && changed && (<span styleName='styles.action' onClick={onUpdate}><Icon name='Unlock' /> {t('Save')}</span>)}
        {!draft && changed && (<span styleName='styles.action' onClick={onReset}><Icon name='Back' /> {t('Revert')}</span>)}
      </div>
      {type === 'group' &&
        <div styleName='styles.responsibility-row'>
          <div styleName='styles.responsibility-stack'>
            <SettingsControl label='Title' controlClass={styles['settings-control']} onChange={onChange('title')} value={title} />
            <SettingsControl label='Description' controlClass={styles['settings-control']} onChange={onChange('description')} value={description} type='textarea' />
          </div>
        </div>}
      {type === 'system' &&
        <div styleName='styles.responsibility-row'>
          <div styleName='styles.system-responsibility-stack'>
            <h5>{title}</h5>
            <span styleName='styles.description'>{description}</span>
          </div>
        </div>}
    </div>
  )
}
