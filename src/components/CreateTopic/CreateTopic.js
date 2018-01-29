import React, { PureComponent } from 'react'
import { isEmpty, trim } from 'lodash/fp'
import { sanitize } from 'hylo-utils/text'

import Button from 'components/Button'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'

import './CreateTopic.scss'

export default class CreateTopic extends PureComponent {
  state = {
    nameRequiredError: false,
    topicName: ''
  }

  submit = () => {
    const topicName = sanitize(trim(this.state.topicName))
    if (isEmpty(topicName)) {
      return this.setState({ topicNameRequired: true })
    }
    this.props.createTopic(topicName)
    this.props.closeModal()
  }

  render () {
    return <div styleName='popup'>
      <div styleName='popup-inner'>
        <h1>Create a Topic</h1>
        <span onClick={this.props.closeModal} styleName='close-btn'>
          <Icon name='Ex' styleName='icon' />
        </span>

        <div styleName='content'>
          <TextInput
            aria-label='topic-name'
            label='topic-name'
            name='topic-name'
            styleName='topic-name'
            placeholder='Enter a topic name:' />
          <Button
            styleName='submit-btn'
            onClick={this.submit}
            disabled={isEmpty(this.state.topicName)}>Add Topic</Button>
        </div>
      </div>
    </div>
  }
}
