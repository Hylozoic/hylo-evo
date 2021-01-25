import React, { Component } from 'react'
import {
  matchPath,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import { baseUrl } from 'util/navigation'
import { POST_TYPES } from 'store/models/Post'
import CreateGroup from 'components/CreateGroup'
import CreateModalChooser from './CreateModalChooser'
import PostEditor from 'components/PostEditor'
import './CreateModal.scss'

export default class CreateModal extends Component {
  render () {
    const { location, match, closeModal } = this.props

    if (!match) return null

    const rootUrl = baseUrl(match.params)

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
            <Route path={`${rootUrl}/create/:postTypeContext(${Object.keys(POST_TYPES).join('|')})`} children={({ match, location }) =>
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
