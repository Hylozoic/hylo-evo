import React, { Component } from 'react'
import { isEmpty, trim } from 'lodash/fp'
import { sanitize } from 'hylo-utils/text'

import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

export default class CreateTopic extends Component {
  state = {
    modalVisible: false,
    nameRequiredError: false,
    topicName: ''
  }

  updateTopicName = ({ target }) => {
    this.setState({ topicName: target.value })
  }

  toggleTopicModal = () =>
    this.setState({
      modalVisible: !this.state.modalVisible
    })

  submitButtonAction = topicName => {
    const name = sanitize(trim(this.state.topicName))
    if (isEmpty(name)) {
      return this.setState({ topicNameRequired: true })
    }
    this.props.createTopic(name)
  }

  submitButtonIsDisabled = () => isEmpty(this.state.topicName)

  render () {
    const { modalVisible } = this.state
    return [
      <Icon name='Plus' styleName='create-button' onClick={this.toggleTopicModal} />,
      modalVisible && <ModalDialog
        closeModal={this.toggleTopicModal}
        modalTitle='Create a Topic'
        submitButtonAction={this.submitButtonAction}
        submitButtonIsDisabled={this.submitButtonIsDisabled}
        submitButtonText='Add Topic'>
        <TextInput
          aria-label='topic-name'
          label='topic-name'
          name='topic-name'
          onChange={this.updateTopicName}
          styleName='topic-name'
          placeholder='Enter a topic name:'
          value={this.state.topicName} />
      </ModalDialog>
    ]
  }
}
