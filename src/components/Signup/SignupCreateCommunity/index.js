import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PostEditor from 'components/PostEditor'
import '../Signup.scss'

export default class SignupCreateCommunity extends Component {
  render () {
    const { match, hidePostEditor } = this.props
    return <ReactCSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      {match && <div
        styleName='post-editor-modal'
        key='post-editor-modal'>
        <div styleName='post-editor-background' className='post-editor-background' />
        <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
          <PostEditor onClose={hidePostEditor} {...this.props} />
        </div>
      </div>}
    </ReactCSSTransitionGroup>
  }
}
