import { isEmpty, trim } from 'lodash'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import TextareaAutosize from 'react-textarea-autosize'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Select from 'components/Select'

import classes from './FlagContent.module.scss'

class FlagContent extends PureComponent {
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
      ? ` ${this.props.t('(explanation required)')}`
      : ''
    const subtitle = this.props.t(`Why was this {{type}} '{{selectedCategory}}'{{required}}?`, { type,
      selectedCategory,
      required })
    this.setState({ subtitle })
  }

  render () {
    const { t } = this.props
    const options = [
      { label: t('Inappropriate Content'), id: 'inappropriate' },
      { label: t('Spam'), id: 'spam' },
      { label: t('Offensive'), id: 'offensive' },
      { label: t('Abusive'), id: 'abusive' },
      { label: t('Illegal'), id: 'illegal' },
      { label: t('Other'), id: 'other' }
    ]

    const {
      subtitle = t('What was wrong?'),
      reasonRequired,
      selectedCategory = '', explanation } = this.state

    return (
      <div className={classes.popup}>
        <div className={classes.popupInner}>
          <h1>{t('Explanation for Flagging')}</h1>
          <span onClick={this.closeModal} className={classes.closeBtn}>
            <Icon name='Ex' className={classes.icon} />
          </span>

          <div className={classes.content}>
            <div className={classes.reason}>
              <Select
                onChange={this.updateSelected}
                fullWidth
                className={cx({
                  [classes.reasonRequired]: reasonRequired
                })}
                selected={selectedCategory}
                placeholder={t('Select a reason')}
                options={options} />
            </div>
            <TextareaAutosize
              className={classes.explanationTextbox}
              minRows={6}
              value={explanation}
              onChange={(e) => { this.setState({ explanation: e.target.value }) }}
              placeholder={subtitle} />
            <Button className={classes.submitBtn} onClick={this.submit} disabled={isEmpty(selectedCategory)}>{t('Submit')}</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default withTranslation()(FlagContent)
