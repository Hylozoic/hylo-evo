import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './PostEditorModal.scss'

export default class PostEditorModal extends Component {
  render () {
    const { match, hidePostEditor } = this.props

    if (!match) return null

    return <CSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <div styleName='post-editor-modal' key='post-editor-modal'>
        <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
          <span styleName='close-button' onClick={hidePostEditor}><Icon name='Ex' /></span>
          <PostEditor {...this.props} />
        </div>
      </div>
    </CSSTransitionGroup>
  }
}
