import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import cx from 'classnames'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import CreateModalChooser from './CreateModalChooser'
import CreateGroup from 'components/CreateGroup'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import classes from './CreateModal.module.scss'

const CreateModal = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const previousLocation = useSelector(getPreviousLocation)
  const [returnToLocation] = useState(previousLocation)
  const [isDirty, setIsDirty] = useState()
  const { t } = useTranslation()

  const querystringParams = new URLSearchParams(location.search)
  const mapLocation = (querystringParams.has('lat') && querystringParams.has('lng'))
    ? `${querystringParams.get('lat')}, ${querystringParams.get('lng')}`
    : null

  const closeModal = () => {
    // `closePath` is currently only passed in the case of arriving here
    // from the `WelcomeModal` when we want to go back on close or cancel.
    const closePathFromParam = querystringParams.get('closePath')
    navigate(closePathFromParam || returnToLocation)
  }

  const confirmClose = () => {
    const confirmed = !isDirty || window.confirm(t('Changes won\'t be saved. Are you sure you want to cancel?'))

    if (confirmed) {
      closeModal()
    }
  }

  return (
    <CSSTransition
      classNames="createModal"
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div className={classes.createModal}>
        <div className={classes.createModalWrapper}>
          <span className={classes.closeButton} onClick={confirmClose}>
            <Icon name='Ex' />
          </span>
          <Routes>
            <Route
              path={'edit'}
              element={
                <PostEditor
                  {...props}
                  selectedLocation={mapLocation}
                  onClose={closeModal}
                  onCancel={confirmClose}
                  setIsDirty={setIsDirty}
                />
              }
            />
            <Route
              path={'create/post'}
              element={
                <PostEditor
                  {...props}
                  selectedLocation={mapLocation}
                  onClose={closeModal}
                  onCancel={confirmClose}
                  setIsDirty={setIsDirty}
                />
              }
            />
            <Route path='create/group' element={<CreateGroup {...props} />} />
            <Route element={<CreateModalChooser {...props} />} />
          </Routes>
        </div>
        <div className={classes.createModalBg} onClick={confirmClose} />
      </div>
    </CSSTransition>
  )
}

export default CreateModal
