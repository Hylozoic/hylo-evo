import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import './PostEditorModal.scss'

export default class PostEditorModal extends Component {
  render () {
    const { match, hidePostEditor } = this.props

    if (!match) return null

    return <CSSTransition
      classNames='post-editor'
      in
      appear
      timeout={{ appear: 400, enter: 400, exit: 300 }}>
      <div styleName='post-editor-modal' key='post-editor-modal'>
        <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
          <span styleName='close-button' onClick={hidePostEditor}><Icon name='Ex' /></span>
          <PostEditor {...this.props} onClose={hidePostEditor} />
        </div>
      </div>
    </CSSTransition>
  }
}
