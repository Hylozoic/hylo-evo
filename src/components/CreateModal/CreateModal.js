import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import CreateGroup from 'components/CreateGroup'
import CreateModalChooser from './CreateModalChooser'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

export default function CreateModal (props) {
  const { location, match, closeModal } = props

  if (!match) return null

  return <CSSTransition
    classNames='create-modal'
    appear
    in
    timeout={{ appear: 400, enter: 400, exit: 300 }}
  >
    <div styleName='create-modal'>
      <div styleName='create-modal-wrapper' className='create-modal-wrapper'>
        <span styleName='close-button' onClick={closeModal}><Icon name='Ex' /></span>
        <Switch>
          <Route path={match.path + `/post`} children={({ match, location }) =>
            <PostEditor match={match} location={location} onClose={closeModal} />} />
          <Route path={match.path + `/group`} children={({ match, location }) =>
            <CreateGroup match={match} location={location} onClose={closeModal} />} />
          <Route>
            <CreateModalChooser match={match} location={location} />
          </Route>
        </Switch>
      </div>
      <div styleName='create-modal-bg' onClick={closeModal} />
    </div>
  </CSSTransition>
}
