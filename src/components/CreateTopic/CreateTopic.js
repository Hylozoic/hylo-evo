import React, { Component } from 'react'
import { debounce, isEmpty, trim } from 'lodash/fp'

import { sanitize } from 'hylo-utils/text'
import { validateTopicName } from 'hylo-utils/validators'
import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

export default class CreateTopic extends Component {
  defaultState = {
    modalTitle: 'Create a Topic',
    modalVisible: false,
    nameError: null,
    showCancelButton: true,
    showSubmitButton: true,
    topicName: '',
    useNotificationFormat: false
  }

  state = this.defaultState

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  updateTopicName = ({ target }) => {
    if (target.value !== '') this.validate(target.value)
    this.setState({ topicName: target.value })
  }

  toggleTopicModal = () => this.setState(
    this.state.modalVisible ? this.defaultState : { modalVisible: true }
  )

  submitButtonAction = topicName => {
    const name = sanitize(
      trim(this.ignoreHash(this.state.topicName))
    )
    if (isEmpty(name)) {
      return this.setState({ nameError: 'Topic name is required.' })
    }
    this.props.createTopic(name, this.props.communityId)
    this.setState({
      modalTitle: 'Topic Created',
      showCancelButton: false,
      showSubmitButton: false,
      useNotificationFormat: true
    })
  }

  submitButtonIsDisabled = () => {
    const { nameError, topicName } = this.state
    return isEmpty(topicName) || nameError
  }

  // Debounce allows the user to type/correct typos
  validate = debounce(1000, name => this.setState({
    nameError: validateTopicName(this.ignoreHash(name))
  }))

  render () {
    const {
      modalTitle,
      modalVisible,
      nameError,
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
