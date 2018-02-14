import React, { Component } from 'react'
import { debounce, isEmpty, trim } from 'lodash/fp'

import { sanitize } from 'hylo-utils/text'
import { validateTopicName } from 'hylo-utils/validators'
import Button from 'components/Button'
import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

export default class CreateTopic extends Component {
  defaultState = {
    closeOnSubmit: false,
    modalTitle: 'Create a Topic',
    modalVisible: false,
    nameError: null,
    showCancelButton: true,
    showSubmitButton: true,
    submitButtonText: 'Add Topic',
    topicName: '',
    useNotificationFormat: false
  }

  state = this.defaultState

  // No text for use with TopicNavigation, text on AllTopics
  buttonChooser = () => this.props.buttonText
    ? <Button
      color='green-white-green-border'
      key='create-button'
      narrow
      onClick={this.toggleTopicModal}
      styleName='create-topic'>{this.props.buttonText}</Button>
    : <Icon key='create-button'
      name='Plus'
      styleName='create-button'
      onClick={this.toggleTopicModal} />

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  updateTopicName = ({ target }) => {
    if (target.value !== '') this.validate(target.value)
    this.setState({ topicName: target.value })
  }

  toggleTopicModal = () => this.setState(
    this.state.modalVisible ? this.defaultState : { modalVisible: true }
  )

  submitButtonAction = topicName => {
    // Just close if we're already at the notification stage
    if (this.state.useNotificationFormat) {
      this.toggleTopicModal()
      return
    }

    const name = sanitize(
      trim(this.ignoreHash(this.state.topicName))
    )
    if (isEmpty(name)) {
      return this.setState({ nameError: 'Topic name is required.' })
    }
    this.props.createTopic(name, this.props.communityId)

    this.setState({
      closeOnSubmit: true,
      modalTitle: 'Topic Created',
      showCancelButton: false,
      submitButtonText: 'Ok',
      useNotificationFormat: true
    })
  }

  submitButtonIsDisabled = () => {
    const { nameError, topicName } = this.state
    return isEmpty(topicName) || !!nameError
  }

  validate = debounce(500, name => this.setState({
    nameError: validateTopicName(this.ignoreHash(name))
  }))

  render () {
    const {
      modalTitle,
      modalVisible,
      nameError,
      showCancelButton,
      showSubmitButton,
      submitButtonText,
      topicName,
      useNotificationFormat
    } = this.state

    return [
      this.buttonChooser(),

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
        submitButtonText={submitButtonText}
        useNotificationFormat={useNotificationFormat}>
        {useNotificationFormat
          ? <div styleName='dialog-content'>you're subscribed to #{this.ignoreHash(topicName)}</div>
          : <div>
            <TextInput
              aria-label='topic-name'
              autoFocus
              label='topic-name'
              name='topic-name'
              onChange={this.updateTopicName}
              placeholder='Enter a topic name:'
              value={this.state.topicName} />
            {nameError && <div styleName='topic-error'>{nameError}</div>}
          </div>}
      </ModalDialog>
    ]
  }
}
