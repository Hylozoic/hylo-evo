import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import CreateModalChooser from './CreateModalChooser'
import CreateGroup from 'components/CreateGroup'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

const CreateModal = (props) => {
  const location = useLocation()
  const history = useHistory()
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
    history.push(closePathFromParam || returnToLocation)
  }

  const confirmClose = () => {
    const confirmed = !isDirty || window.confirm(t('CreateModal.confirmCancel'))

    if (confirmed) {
      closeModal()
    }
  }

  return (
    <CSSTransition
      classNames='create-modal'
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div styleName='create-modal'>
        <div styleName='create-modal-wrapper' className='create-modal-wrapper'>
          <span styleName='close-button' onClick={confirmClose}>
            <Icon name='Ex' />
          </span>
          <Switch>
            <Route path={['(.*)/create/post', '(.*)/edit']}>
              <PostEditor
                {...props}
                selectedLocation={mapLocation}
                onClose={closeModal}
                onCancel={confirmClose}
                setIsDirty={setIsDirty}
              />
            </Route>
            <Route path='(.*)/create/group'>
              <CreateGroup {...props} />
            </Route>
            <Route>
              <CreateModalChooser {...props} />
            </Route>
          </Switch>
        </div>
        <div styleName='create-modal-bg' onClick={confirmClose} />
      </div>
    </CSSTransition>
  )
}

export default CreateModal
