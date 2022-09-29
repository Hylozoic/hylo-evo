import React, { PureComponent } from 'react'
import { isEmpty, trim } from 'lodash'
import './FlagContent.scss'
import Select from 'components/Select'
import Button from 'components/Button'
import Icon from 'components/Icon'
import TextareaAutosize from 'react-textarea-autosize'

export default class FlagContent extends PureComponent {
  state = {
    promptVisible: false,
    highlightRequired: false,
    reasonRequired: false,
    explanation: ''
  }

  static defaultProps = {
    promptVisible: false,
    highlightRequired: false,
    reasonRequired: false,
    explanation: ''
  }

  closeModal = () => {
    this.setState({ promptVisible: false, highlightRequired: false })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  isExplanationOptional = (selectedCategory) =>
    (selectedCategory || this.state.selectedCategory) !== 'other'

  submit = () => {
    const { submitFlagContent, linkData } = this.props
    const { selectedCategory, explanation } = this.state

    if (isEmpty(selectedCategory)) {
      this.setState({ reasonRequired: true })
      return
    }

    if (!this.isExplanationOptional() && isEmpty(trim(explanation))) {
      this.setState(
        { highlightRequired: true },
        () => this.updateSelected(selectedCategory)
      )
    } else {
      submitFlagContent(selectedCategory, trim(explanation), linkData)
      this.closeModal()
      return true
    }

    return false
  }

  cancel = () => {
    this.setState({
      highlightRequired: false
    })
    this.closeModal()
  }

  updateSelected = (selectedCategory) => {
    this.setState({ selectedCategory })
    const { type = 'content' } = this.props
    const { highlightRequired } = this.state

    const required = !this.isExplanationOptional(selectedCategory) && highlightRequired
      ? ' (explanation required)'
      : ''
    const subtitle = `Why was this ${type} '${selectedCategory}'${required}?`
    this.setState({ subtitle })
  }

  render () {
    const options = [
      { label: 'Inappropriate Content', id: 'inappropriate' },
      { label: 'Spam', id: 'spam' },
      { label: 'Offensive', id: 'offensive' },
      { label: 'Abusive', id: 'abusive' },
      { label: 'Illegal', id: 'illegal' },
      { label: 'Other', id: 'other' }
    ]

    const {
      subtitle = 'What was wrong?',
      reasonRequired,
      selectedCategory = '', explanation } = this.state

    return <div styleName='popup'>
      <div styleName='popup-inner'>
        <h1>Explanation for Flagging</h1>
        <span onClick={this.closeModal} styleName='close-btn'>
          <Icon name='Ex' styleName='icon' />
        </span>

        <div styleName='content'>
          <div styleName='reason'>
            <Select
              onChange={this.updateSelected}
              fullWidth
              styleName={reasonRequired ? 'reason-required' : ''}
              selected={selectedCategory}
              placeholder='Select a reason'
              options={options} />
          </div>
          <TextareaAutosize
            styleName='explanation-textbox'
            minRows={6}
            value={explanation}
            onChange={(e) => { this.setState({ explanation: e.target.value }) }}
            placeholder={subtitle} />
          <Button styleName='submit-btn' onClick={this.submit} disabled={isEmpty(selectedCategory)}>Submit</Button>
        </div>
      </div>
    </div>
  }
}
