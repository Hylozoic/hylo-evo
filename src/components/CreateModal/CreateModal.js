import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import CreateModalChooser from './CreateModalChooser'
import CreateGroup from 'components/CreateGroup'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

export default function CreateModal (props) {
  const location = useLocation()
  const history = useHistory()
  const previousLocation = useSelector(getPreviousLocation)
  const [returnToLocation] = useState(previousLocation)
  const [isDirty, setIsDirty] = useState()

  const querystringParams = Object.fromEntries(new URLSearchParams(location.search))
  const mapLocation = (querystringParams.lat && querystringParams.lng) &&
    `${querystringParams.lat}, ${querystringParams.lng}`

  const closeModal = () => {
    const closePathFromParam = querystringParams.closePath
    history.push(closePathFromParam || returnToLocation)
    return null
  }

  const confirmClose = () => {
    const confirmed = !isDirty || window.confirm('Changes won\'t be saved. Are you sure you want to cancel?')

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
