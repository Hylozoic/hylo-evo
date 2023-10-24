import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import update from 'immutability-helper'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import SettingsControl from 'components/SettingsControl'
import {
  updateGroupSettings
} from '../GroupSettings.store'

import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './AgreementsTab.scss' // eslint-disable-line no-unused-vars

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
      return { color: 'purple', style: 'general.settingIncorrect', text: error }
    }
    return { color: 'green', style: 'general.settingChanged', text: t('Changes not saved') }
  }, [changed, error])

  if (!group) return <Loading />

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={agreements} strategy={verticalListSortingStrategy}>

        <div styleName='general.groupSettings'>
          <h1>{t('Group Agreements')}</h1>
          <p>{t('groupAgreementsDescription')}</p>
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
          <div styleName='styles.add-button' onClick={addAgreement}>
            <h4>{t('Add Agreement')}</h4>
            <Icon name='Circle-Plus' styleName='styles.add-button-icon' />
          </div>

          <br />

          <div styleName='general.saveChanges'>
            <span styleName={saveButtonContent().style}>{saveButtonContent().text}</span>
            <Button label={t('Save Changes')} color={saveButtonContent().color} onClick={changed && !error ? save : null} className='save-button' styleName='general.save-button' />
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
    <div styleName='styles.agreement-row' ref={ref} style={style}>
      <div styleName='styles.header' {...listeners} {...attributes} ref={setActivatorNodeRef}>
        <strong>{viewCount})</strong>
        <div styleName='styles.controls'>
          <Icon name='Draggable' styleName='styles.drag-handle' />
          <Icon name='Trash' onClick={onDelete} styleName='styles.delete-button' />
        </div>
      </div>
      <SettingsControl
        controlClass={styles['settings-control']}
        label={t('Title')}
        onChange={onChange('title')}
        placeholder={exampleText(t)}
        value={title}
      />
      <SettingsControl
        controlClass={styles['settings-control']}
        label={t('Description')}
        onChange={onChange('description')}
        placeholder={t('Describe the agreement and what the group expects from its members')}
        type='textarea'
        value={description}
      />
    </div>
  )
})

AgreementsTab.propTypes = {
  group: object
}

export default AgreementsTab
