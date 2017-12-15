import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import PostEditor from 'components/PostEditor'
import './PostEditorModal.scss'

export default class PostEditorModal extends Component {
  render () {
    const { match, hidePostEditor } = this.props
    return <CSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      {match && <div
        styleName='post-editor-modal'
        key='post-editor-modal'>
        <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
          <PostEditor onClose={hidePostEditor} {...this.props} />
        </div>
      </div>}
    </CSSTransitionGroup>
  }
}
