import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { isEmpty, trim } from 'lodash'
import './FlagContent.scss'
import Select from 'components/Select'
import Button from 'components/Button'
import TextareaAutosize from 'react-textarea-autosize'

export default class FlagContent extends PureComponent {
  state = {
    promptVisible: false,
    highlightRequired: false,
    explanation: ''
  }

  static defaultProps = {
    promptVisible: false,
    highlightRequired: false,
    explanation: ''
  }

  closeModal = () => {
    this.setState({promptVisible: false, highlightRequired: false})
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  isOptionalExplanation = (selectedCategory) =>
  (selectedCategory || this.state.selectedCategory) !== 'other'

  submit = (value) => {
    const {submitFlagContent, linkData} = this.props
    const {selectedCategory, explanation} = this.state

    if (isEmpty(selectedCategory)) {
      this.setState({reasonRequired: true})
      return
    }

    if (!this.isOptionalExplanation() && isEmpty(trim(explanation))) {
      console.log('highlight required')
      this.setState({highlightRequired: true})
      this.updateSelected(selectedCategory)
    } else {
      console.log('closing!!!')
      submitFlagContent(selectedCategory, trim(value), linkData)
      this.closeModal()
    }
  }

  cancel = () => {
    this.setState({
      highlightRequired: false
    })
    this.closeModal()
  }

  updateSelected = (selectedCategory) => {
    this.setState({selectedCategory})
    const {type = 'content'} = this.props
    const {highlightRequired} = this.state

    var subtitle = `Why was this ${type} '${selectedCategory}'`
    if (!this.isOptionalExplanation(selectedCategory) && highlightRequired) {
      subtitle += ' (explanation required)'
    }
    this.setState({subtitle})
  }

  render () {
    const options = [
      {label: 'Inappropriate Content', id: 'inappropriate'},
      {label: 'Spam', id: 'spam'},
      {label: 'Offensive', id: 'offensive'},
      {label: 'Illegal', id: 'illegal'},
      {label: 'Other', id: 'other'}
    ]

    const {subtitle = 'Select a reason', selectedCategory = '', explanation} = this.state

    return ReactDOM.createPortal(
      <div styleName='popup'>
        <div styleName='popup_inner'>
          <h1>Explanation for Flagging</h1>
          <button styleName='close-btn' onClick={this.closeModal}>X</button>

          <div styleName='content'>
            <div styleName='reason'>
              <Select
                onChange={this.updateSelected}
                fullWidth
                selected={selectedCategory}
                placeholder='What was wrong?'
                options={options} />
            </div>
            <TextareaAutosize
              styleName='explanation-textbox'
              minRows={6}
              value={explanation}
              placeholder={subtitle} />
            <Button styleName='submit-btn' onClick={this.submit}>Submit</Button>
          </div>
        </div>
      </div>,
      document.getElementById('root')
    )
  }
}
