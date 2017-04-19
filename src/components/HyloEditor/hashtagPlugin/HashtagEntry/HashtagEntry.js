import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'

import './HashtagEntry.scss'

export default class HashtagEntry extends Component {
  static propTypes = {
    completion: PropTypes.instanceOf(Immutable.Map).isRequired,
    index: PropTypes.number.isRequired,
    isFocused: PropTypes.bool.isRequired,
    onCompletionFocus: PropTypes.func.isRequired,
    onCompletionSelect: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.mouseDown = false
  }

  componentDidUpdate () {
    this.mouseDown = false
  }

  onMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false
      this.props.onCompletionSelect(this.props.completion)
    }
  }

  onMouseDown = (event) => {
    // Note: important to avoid a content edit change
    event.preventDefault()

    this.mouseDown = true
  }

  onMouseEnter = () => {
    this.props.onCompletionFocus(this.props.index)
  }

  render () {
    const className = this.props.isFocused ? 'hashtagSuggestionsEntryFocused' : 'hashtagSuggestionsEntry'
    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        role='option'
      >
        <span className='hashtagSuggestionsEntryText'>
          <span className='bold'>#{this.props.completion.get('name')}</span>
        </span>
      </div>
    )
  }
}
