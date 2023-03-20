import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { any, arrayOf, func, object, string, bool } from 'prop-types'
import { debounce, has, get, isEmpty, trim } from 'lodash/fp'
import { Validators } from 'hylo-shared'
import { topicUrl } from 'util/navigation'
import Button from 'components/Button'
import Icon from 'components/Icon'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

class CreateTopic extends Component {
  static propTypes = {
    buttonText: string,
    groupId: any,
    groupSlug: string,
    groupTopicExists: object,
    topics: arrayOf(object),
    createTopic: func,
    fetchGroupTopic: func,
    subscribeAfterCreate: bool
  }

  defaultState = {
    closeOnSubmit: false,
    modalTitle: this.props.t('Create a Topic'),
    modalVisible: false,
    nameError: null,
    loading: false,
    showCancelButton: true,
    showSubmitButton: true,
    submitButtonText: this.props.t('Add Topic'),
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
    const { groupSlug } = this.props
    const name = this.safeTopicName()
    // This syntax handles topic names with dots in 'em
    const topicPath = [ 'groupTopicExists', encodeURI(name), groupSlug ]
    if (!has(topicPath, prevProps) && has(topicPath, this.props)) {
      return get(topicPath, this.props)
        ? this.subscribeAndRedirect(name)
        : this.createAndNotify(name)
    }
  }

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  createAndNotify = name => {
    this.props.createTopic(name, this.props.groupId, false, !!this.props.subscribeAfterCreate)

    // Note: assumes success
    this.setState({
      closeOnSubmit: true,
      loading: false,
      modalTitle: this.props.t('Topic Created'),
      showCancelButton: false,
      submitButtonText: this.props.t('Ok'),
      useNotificationFormat: true
    })
  }

  // TODO: Text Formatting -- sanitize only on output, not input
  safeTopicName = () => trim(this.ignoreHash(this.state.topicName))

  submitButtonAction = () => {
    const {
      groupSlug,
      groupTopicExists,
      topics,
      fetchGroupTopic,
      subscribeAfterCreate } = this.props

    const name = this.safeTopicName()
    if (isEmpty(name)) {
      return this.setState({ nameError: this.props.t('Topic name is required.') })
    }

    // First, check if we already have the topic, and it has posts. If so, we
    // redirect to show the user the topic, but we also need to subscribe them.
    const existingTopic = topics.find(t => t.name === name)
    if (existingTopic && subscribeAfterCreate) {
      return this.subscribeAndRedirect(name)
    }

    // No existing topic client-side, but it might be on the server
    if (!this.state.loading && !has(`${name}.${groupSlug}`, groupTopicExists)) {
      this.setState({ loading: true })
      return fetchGroupTopic(name, groupSlug)
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
    this.props.createTopic(name, this.props.groupId, false, !!this.props.subscribeAfterCreate)
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
    nameError: Validators.validateTopicName(this.ignoreHash(name))
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
      useNotificationFormat,
      t
    } = this.state
    const { subscribeAfterCreate, t } = this.props

    if (redirectTopic && subscribeAfterCreate) {
      const url = topicUrl(encodeURI(redirectTopic), { groupSlug: this.props.groupSlug })
      if (url !== window.location.pathname) return <Redirect to={url} />
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
          ? (subscribeAfterCreate ? <div styleName='dialog-content'>{t('you\'re subscribed to #{{topicName}}', { topicName: this.ignoreHash(topicName) })}</div> : <div styleName='dialog-content'>{t('Created topic #{{topicName}}', { topicName: this.ignoreHash(topicName) })}</div>)
          : <div>
            <TextInput
              aria-label='topic-name'
              autoFocus
              label='topic-name'
              name='topic-name'
              onChange={this.updateTopicName}
              loading={loading}
              placeholder={t('Enter a topic name:')}
              value={this.state.topicName} />
            {nameError && <div styleName='topic-error'>{nameError}</div>}
          </div>}
      </ModalDialog>}
    </React.Fragment>
  }
}
export default withTranslation()(CreateTopic)
