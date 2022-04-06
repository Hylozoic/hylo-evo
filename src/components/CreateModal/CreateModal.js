import { push } from 'connected-react-router'
import { get, omit } from 'lodash/fp'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import CreateModalChooser from './CreateModalChooser'
import CreateGroup from 'components/CreateGroup'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { addQuerystringToPath, baseUrl, postUrl } from 'util/navigation'

import './CreateModal.scss'

export default function CreateModal (props) {
  const { location, match } = props
  if (!match) return null
  const routeParams = get('match.params', props)
  if (!routeParams) return null

  const dispatch = useDispatch()
  const [isDirty, setIsDirty] = useState()
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const locationParams = getQuerystringParam(['zoom', 'center', 'lat', 'lng'], null, props)
  const mapLocation = (locationParams.lat && locationParams.lng) &&
    `${locationParams.lat}, ${locationParams.lng}`

  const { action, postId } = routeParams
  const urlParams = omit(['postId', 'action'], routeParams)
  const closeUrl = postId
    ? postUrl(postId, urlParams, { ...locationParams, ...querystringParams })
    : addQuerystringToPath(baseUrl(urlParams), { ...locationParams, ...querystringParams })

  const closeModal = () => dispatch(push(closeUrl))

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
          {postId && action === 'edit'
            ? (
              <PostEditor
                {...props}
                onClose={closeModal}
                onCancel={confirmClose}
                setIsDirty={setIsDirty}
              />
            ) : (
              <Switch>
                <Route
                  path={match.path + '/post'}
                  children={({ match, location }) => (
                    <PostEditor
                      {...props}
                      selectedLocation={mapLocation}
                      onClose={closeModal}
                      onCancel={confirmClose}
                      setIsDirty={setIsDirty}
                    />
                  )}
                />
                <Route
                  path={match.path + `/group`}
                  children={({ match, location }) => (
                    <CreateGroup
                      match={match}
                      location={location}
                      onClose={closeModal}
                    />
                  )}
                />
                <Route>
                  <CreateModalChooser match={match} location={location} />
                </Route>
              </Switch>
            )
          }
        </div>
        <div styleName='create-modal-bg' onClick={confirmClose} />
      </div>
    </CSSTransition>
  )
}
