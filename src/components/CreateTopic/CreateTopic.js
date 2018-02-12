import React, { Component } from 'react'
import { isEmpty, trim } from 'lodash/fp'
import { sanitize } from 'hylo-utils/text'

import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

export default class CreateTopic extends Component {
  defaultState = {
    modalVisible: false,
    nameRequiredError: false,
    modalTitle: 'Create a Topic',
    showCancelButton: true,
    showSubmitButton: true,
    topicName: '',
    useNotificationFormat: false
  }

  state = this.defaultState

  updateTopicName = ({ target }) => {
    this.setState({ topicName: target.value })
  }

  toggleTopicModal = () => this.setState(
    this.state.modalVisible ? this.defaultState : { modalVisible: true }
  )

  submitButtonAction = topicName => {
    const name = sanitize(trim(this.state.topicName))
    if (isEmpty(name)) {
      return this.setState({ topicNameRequired: true })
    }
    this.props.createTopic(name, this.props.communityId)
    this.setState({
      modalTitle: 'Topic Created',
      showCancelButton: false,
      showSubmitButton: false,
      useNotificationFormat: true
    })
  }

  submitButtonIsDisabled = () => isEmpty(this.state.topicName)

  render () {
    const {
      modalTitle,
      modalVisible,
      showCancelButton,
      showSubmitButton,
      topicName,
      useNotificationFormat
    } = this.state
    return [
      <Icon key='create-button'
        name='Plus'
        styleName='create-button'
        onClick={this.toggleTopicModal} />,

      modalVisible && <ModalDialog key='create-dialog'
        backgroundImage='axolotl-corner.png'
        closeModal={this.toggleTopicModal}
        closeOnSubmit={false}
        modalTitle={modalTitle}
        notificationIconName='Star'
        showCancelButton={showCancelButton}
        showSubmitButton={showSubmitButton}
        submitButtonAction={this.submitButtonAction}
        submitButtonIsDisabled={this.submitButtonIsDisabled}
        submitButtonText='Add Topic'
        useNotificationFormat={useNotificationFormat}>
        {useNotificationFormat
          ? <div>you're subscribed to #{topicName}</div>
          : <TextInput
            aria-label='topic-name'
            label='topic-name'
            name='topic-name'
            onChange={this.updateTopicName}
            styleName='topic-name'
            placeholder='Enter a topic name:'
            value={this.state.topicName} />}
      </ModalDialog>
    ]
  }
}
