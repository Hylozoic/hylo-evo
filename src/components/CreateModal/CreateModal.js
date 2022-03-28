import { push } from 'connected-react-router'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import CreateModalChooser from './CreateModalChooser'
import CreateGroup from 'components/CreateGroup'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'

import './CreateModal.scss'

export default function CreateModal (props) {
  const dispatch = useDispatch()
  const [isDirty, setIsDirty] = useState()
  const [initialLocation] = useState(props.location)
  // Set the return to location to be the initial location without
  // /create, /create/post, /create/group, or /edit
  // There is probably a better way, but this is tolerable for now
  const returnToLocation = {
    ...initialLocation,
    pathname: initialLocation.pathname.replace(/(\/create|\/create\/post|\/create\/group|edit)$|/gi, '')
  }

  const closeModal = () => {
    dispatch(push(returnToLocation))
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
