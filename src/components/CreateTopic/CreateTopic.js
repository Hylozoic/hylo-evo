import React, { Component } from 'react'
import { any, arrayOf, func, object, string } from 'prop-types'
import { debounce, has, get, isEmpty, trim } from 'lodash/fp'
import { sanitize } from 'hylo-utils/text'
import { validateTopicName } from 'hylo-utils/validators'
import { tagUrl } from 'util/navigation'

import Button from 'components/Button'
import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import RedirectRoute from 'router/RedirectRoute'

import './CreateTopic.scss'

export default class CreateTopic extends Component {
  static propTypes = {
    buttonText: string,
    communityId: any,
    communitySlug: string,
    communityTopicExists: object,
    communityTopics: arrayOf(object),
    createTopic: func,
    fetchCommunityTopic: func
  }

  defaultState = {
    closeOnSubmit: false,
    modalTitle: 'Create a Topic',
    modalVisible: false,
    nameError: null,
    loading: false,
    showCancelButton: true,
    showSubmitButton: true,
    submitButtonText: 'Add Topic',
    topicName: '',
    useNotificationFormat: false
  }

  state = this.defaultState

  // No text for use with TopicNavigation, text on AllTopics.
  buttonChooser = () => this.props.buttonText
    ? <Button
      color='green-white-green-border'
      key='create-button'
      narrow
      onClick={this.toggleTopicModal}
      styleName='create-topic'>
      <Icon name='Plus' green styleName='plus' />{this.props.buttonText}</Button>
    : <Icon
      key='create-button'
      name='Plus'
      onClick={this.toggleTopicModal}
      styleName='create-button' />

  componentDidUpdate (prevProps) {
    const { communitySlug } = this.props
    const name = this.safeTopicName()
    // This syntax handles topic names with dots in 'em
    const topicPath = [ 'communityTopicExists', encodeURI(name), communitySlug ]
    if (!has(topicPath, prevProps) && has(topicPath, this.props)) {
      return get(topicPath, this.props)
        ? this.subscribeAndRedirect(name)
        : this.createAndNotify(name)
    }
  }

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  createAndNotify = name => {
    this.props.createTopic(name, this.props.communityId)

    // Note: assumes success
    this.setState({
      closeOnSubmit: true,
      loading: false,
      modalTitle: 'Topic Created',
      showCancelButton: false,
      submitButtonText: 'Ok',
      useNotificationFormat: true
    })
  }

  safeTopicName = () => sanitize(trim(this.ignoreHash(this.state.topicName)))

  submitButtonAction = () => {
    const {
      communitySlug,
      communityTopicExists,
      communityTopics,
      fetchCommunityTopic } = this.props

    const name = this.safeTopicName()
    if (isEmpty(name)) {
      return this.setState({ nameError: 'Topic name is required.' })
    }

    // First, check if we already have the topic, and it has posts. If so, we
    // redirect to show the user the topic, but we also need to subscribe them.
    const existingTopic = communityTopics.find(t => t.topic.name === name)
    if (existingTopic) {
      return this.subscribeAndRedirect(name)
    }

    // No existing topic client-side, but it might be on the server
    if (!this.state.loading && !has(`${name}.${communitySlug}`, communityTopicExists)) {
      this.setState({ loading: true })
      return fetchCommunityTopic(name, communitySlug)
    }

    // Just close if no topic exists by this stage.
    this.toggleTopicModal()
  }

  submitButtonIsDisabled = () => {
    const { nameError, topicName } = this.state
    return isEmpty(topicName) || !!nameError
  }

  subscribeAndRedirect = name => {
    // The simplest way to subscribe is to 'abuse' createTopic, since it will
    // ensure topic exists in the client, and silently subscribes user.
    this.props.createTopic(name, this.props.communityId)
    return this.toggleTopicModal(name)
  }

  // If redirectTopic present, next render after state change will redirect
  toggleTopicModal = redirectTopic => {
    const endState = {
      ...this.defaultState,
      redirectTopic
    }
    this.setState(this.state.modalVisible ? endState : { modalVisible: true })
  }

  updateTopicName = ({ target }) => {
    if (target.value !== '') this.validate(target.value)
    this.setState({ topicName: target.value })
  }

  validate = debounce(500, name => this.setState({
    nameError: validateTopicName(this.ignoreHash(name))
  }))

  render () {
    const {
      loading,
      modalTitle,
      modalVisible,
      nameError,
      redirectTopic,
      showCancelButton,
      showSubmitButton,
      submitButtonText,
      topicName,
      useNotificationFormat
    } = this.state

    if (redirectTopic) {
      const topicUrl = tagUrl(encodeURI(redirectTopic), this.props.communitySlug)
      if (topicUrl !== window.location.pathname) return <RedirectRoute to={topicUrl} />
    }

    return <React.Fragment>
      {this.buttonChooser()}
      {modalVisible && <ModalDialog key='create-dialog'
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
              loading={loading}
              placeholder='Enter a topic name:'
              value={this.state.topicName} />
            {nameError && <div styleName='topic-error'>{nameError}</div>}
          </div>}
      </ModalDialog>}
    </React.Fragment>
  }
}
