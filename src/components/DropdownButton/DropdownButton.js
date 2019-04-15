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

  onChoose = value => {
    const { onChoose } = this.props
    this.setState({
      expanded: false
    })
    onChoose(value)
  }

  render () {
    const { label, className, choices } = this.props
    const { expanded } = this.state
    return <div>
      <div
        role='button'
        styleName='dropdownButton green narrow small'
        className={className}
        onClick={this.toggleExpanded}>
        {label}&nbsp;&nbsp;|&nbsp;&nbsp;▾
      </div>
      <div styleName={cx('dropdown', {expanded})}>
        {choices.map(({label, value}) =>
          <span styleName='choice' key={value} onClick={() => this.onChoose(value)}>{label}</span>)}
      </div>
    </div>
  }
}