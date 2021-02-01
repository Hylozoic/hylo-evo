import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import { removeCreateFromUrl } from 'util/navigation'
import CreateGroup from 'components/CreateGroup'
import CreateModalChooser from './CreateModalChooser'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

export default class CreateModal extends Component {
  render () {
    const { location, match, closeModal } = this.props

    if (!match) return null

    const rootUrl = removeCreateFromUrl(location.pathname)

    return <CSSTransitionGroup
      transitionName='create-modal'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <div styleName='create-modal' key='create-modal'>
        <div styleName='create-modal-wrapper' className='create-modal-wrapper'>
          <span styleName='close-button' onClick={closeModal}>X</span>
          <Switch>
            <Route path={`${rootUrl}/create/post`} children={({ match, location }) =>
              <PostEditor match={match} location={location} onClose={closeModal} />} />
            <Route path={`${rootUrl}/create/group`} children={({ match, location }) =>
              <CreateGroup match={match} location={location} onClose={closeModal} />} />
            <Route path={location.pathname} exact children={({ match, location }) =>
              <CreateModalChooser match={match} location={location} />} />
          </Switch>
        </div>
      </div>
    </CSSTransitionGroup>
  }
}
