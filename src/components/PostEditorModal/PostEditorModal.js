import React, { Component } from 'react'
import HyloModal from 'components/HyloModal'
import PostEditor from 'components/PostEditor'

export default class PostEditorModal extends Component {
  render () {
    return <HyloModal
      ref={component => { this.modal = component }}
      shouldCloseOnOverlayClick={false}
      afterOpenModal={this.postEditor && this.postEditor.focus}
    >
      <PostEditor
        ref={component => { this.postEditor = component }}
        onClose={this.modal && this.modal.closeModal}
        {...this.props}
      />
    </HyloModal>
  }
}
