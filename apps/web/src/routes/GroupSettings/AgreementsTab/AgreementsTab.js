import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import update from 'immutability-helper'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Button from 'components/Button'
import Icon, { IconWithRef } from 'components/Icon'
import Loading from 'components/Loading'
import SettingsControl from 'components/SettingsControl'
import {
  updateGroupSettings
} from '../GroupSettings.store'

import classes from '../GroupSettings.module.scss'
import styles from './AgreementsTab.module.scss'

const { object } = PropTypes

const emptyAgreement = {
  description: '',
  title: ''
}

function AgreementsTab (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [agreements, setAgreements] = useState([])
  const [changed, setChanged] = useState(false)
  const [error, setError] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)

  const { group } = props

  useEffect(() => {
    setAgreements(group?.agreements || [])
    setChanged(false)
    setError(null)
  }, [group])

  const validate = () => {
    let errorString = ''

    agreements.forEach(a => {
      const { title } = a
      if (title.length < 2) {
        errorString += t('Title needs to be at least two characters long.') + ' \n'
      }
    })
    setError(errorString)
  }

  const save = async () => {
    setChanged(false)
    dispatch(updateGroupSettings(group.id, { agreements }))
  }

  const addAgreement = () => {
    setAgreements([...agreements].concat({ ...emptyAgreement, order: agreements.length }))
  }

  const deleteAgreement = (i) => () => {
    if (window.confirm(t('Are you sure you want to delete this agreement?'))) {
      const newAgreements = [...agreements]
      newAgreements.splice(i, 1)
      setChanged(true)
      setAgreements(newAgreements)
    }
  }

  const updateAgreement = (i) => (key) => (v) => {
    let value = typeof (v.target) !== 'undefined' ? v.target.value : v
    const agreement = { ...agreements[i] }

    if (key === 'order') {
      value = parseInt(value)
    }

    agreement[key] = value
    const newAgreements = [...agreements]
    newAgreements[i] = agreement
    setChanged(true)
    setAgreements(newAgreements)
    validate()
  }

  const handleDragStart = useCallback((event) => {
    setDragIndex(event.active.data.current.sortable.index)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setAgreements((prevAgreements) => {
        setChanged(true)
        return update(prevAgreements, {
          $splice: [
            [active.data.current.sortable.index, 1],
            [over.data.current.sortable.index, 0, prevAgreements[active.data.current.sortable.index]]
          ]
        })
      })
    }
    setDragIndex(null)
  }, [])

  const saveButtonContent = useCallback(() => {
    if (!changed) return { color: 'gray', style: '', text: t('Current settings up to date') }
    if (error) {
      return { color: 'purple', style: classes.settingIncorrect, text: error }
    }
    return { color: 'green', style: classes.settingChanged, text: t('Changes not saved') }
  }, [changed, error])

  if (!group) return <Loading />

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={agreements} strategy={verticalListSortingStrategy}>
        <div className={classes.groupSettings}>
          <h1>{t('Group Agreements')}</h1>
          <p>{t('groupAgreementsDescription')}</p>
          <p className={styles.warning}>{t('groupAgreementsWarning')}</p>
          <div>
            {agreements.map((agreement, i) => (
              <AgreementRowDraggable
                key={i}
                index={i}
                dragging={i === dragIndex}
                agreement={agreement}
                onChange={updateAgreement(i)}
                onDelete={deleteAgreement(i)}
                // reorderAgreement={reorderAgreement}
              />
            ))}
          </div>
          <div className={styles.addButton} onClick={addAgreement}>
            <h4>{t('Add Agreement')}</h4>
            <Icon name='Circle-Plus' className={styles.addButtonIcon} />
          </div>

          <br />

          <div className={classes.saveChanges}>
            <span className={saveButtonContent().style}>{saveButtonContent().text}</span>
            <Button
              label={t('Save Changes')}
              color={saveButtonContent().color}
              onClick={changed && !error ? save : null}
              className={classes.saveButton}
            />
          </div>
        </div>
      </SortableContext>

      <DragOverlay>
        {dragIndex !== null
          ? (
            <AgreementRow
              agreement={agreements[dragIndex]}
              index={dragIndex}
              onChange={updateAgreement(dragIndex)}
              onDelete={deleteAgreement(dragIndex)}
            />)
          : null}
      </DragOverlay>
    </DndContext>
  )
}

function AgreementRowDraggable ({
  agreement,
  index,
  onChange,
  onDelete,
  reorderAgreement,
  dragging
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: agreement.id,
    transition: {
      duration: 150, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    opacity: dragging ? 0 : 1
  }

  return (
    <AgreementRow
      ref={setNodeRef}
      {...{ agreement, attributes, index, onChange, onDelete, reorderAgreement, dragging, listeners, setActivatorNodeRef, style }}
    />
  )
}

function exampleText (t) {
  const exampleString = [
    t('Example: "I will not spread misinformation"'),
    t('Example: "I will only post content relevant to this group"'),
    t('Example: "I promise to be kind to other members"'),
    t('Example: "I will not troll or be intentionally divisive"'),
    t('Example: "I will contribute positive and generative energy to discussions"')
  ]

  const randomString = Math.floor(Math.random() * exampleString.length)

  return exampleString[randomString]
}

const AgreementRow = forwardRef(({ children, ...props }, ref) => {
  const {
    agreement,
    attributes,
    index,
    onChange,
    onDelete,
    listeners,
    setActivatorNodeRef,
    style
  } = props

  const { t } = useTranslation()
  const { description, title } = agreement

  const viewCount = parseInt(index) + 1

  return (
    <div className={styles.agreementRow} ref={ref} style={style}>
      <div className={styles.header}>
        <strong>{viewCount})</strong>
        <div className={styles.controls}>
          <IconWithRef name='Draggable' className={styles.dragHandle} {...listeners} {...attributes} ref={setActivatorNodeRef} />
          <Icon name='Trash' onClick={onDelete} className={styles.deleteButton} />
        </div>
      </div>
      <SettingsControl
        controlClass={styles.settingsControl}
        label={t('Title')}
        onChange={onChange('title')}
        placeholder={exampleText(t)}
        value={title}
      />
      <SettingsControl
        controlClass={styles.settingsControl}
        label={t('Description')}
        onChange={onChange('description')}
        placeholder={t('Describe the agreement and what the group expects from its members')}
        type='textarea'
        value={description}
        style={{ minHeight: '60px' }}
      />
    </div>
  )
})

AgreementsTab.propTypes = {
  group: object
}

export default AgreementsTab
