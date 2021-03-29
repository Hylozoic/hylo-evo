import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import CreateGroup from 'components/CreateGroup'
import CreateModalChooser from './CreateModalChooser'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

export default class CreateModal extends Component {
  render () {
    const { location, match, closeModal } = this.props

    if (!match) return null

    return <CSSTransitionGroup
      transitionName='create-modal'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <div styleName='create-modal' key='create-modal'>
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
      </div>
    </CSSTransitionGroup>
  }
}
