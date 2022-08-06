import React, { Component } from 'react'
import './DropdownButton.scss'
import cx from 'classnames'

export default class DropdownButton extends Component {
  state = {
    expanded: false
  }

  toggleExpanded = () => {
    const { expanded } = this.state
    this.setState({
      expanded: !expanded
    })
  }

  onChoose = (value, label) => {
    const { onChoose } = this.props
    this.setState({
      expanded: false
    })
    onChoose(value)
  }

  render () {
    const { label, className, choices, position } = this.props
    const { expanded } = this.state

    return <div>
      <div
        role='button'
        styleName='dropdownButton green narrow small'
        className={className}
        onClick={this.toggleExpanded}>
        {label}&nbsp;&nbsp;|&nbsp;&nbsp;▾
      </div>
      <div styleName={cx('dropdown', { expanded, top: position === 'top' })}>
        {choices.map(({ label, value }) =>
          <span styleName='choice' key={value} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onChoose(value, label) }}>{label}</span>)}
      </div>
    </div>
  }
}
