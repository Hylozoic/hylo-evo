import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PostEditor from 'components/PostEditor'
import './PostEditorModal.scss'

export default class SignupCreateCommunity extends Component {
  render () {
    const { match, hidePostEditor } = this.props
    return <ReactCSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <div
        styleName='post-editor-modal'
        key='post-editor-modal'>
        <div styleName='post-editor-background' className='post-editor-background' />
        <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
          <h1>Popup</h1>
        </div>
      </div>
    </ReactCSSTransitionGroup>
  }
}
