import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import SwitchStyled from 'components/SwitchStyled'
import './PublicToggle.scss'
const { func, bool } = PropTypes

export default class PublicToggle extends Component {
  static propTypes = {
    isPublic: bool,
    togglePublic: func
  }

  static defaultProps = {
    isPublic: false
  }

  render () {
    const { isPublic, togglePublic } = this.props

    return (
      <div styleName={cx('publicToggleContainer', { postIsPublic: isPublic })}>
        <div styleName='publicToggle'>
          <SwitchStyled checked={isPublic} onChange={togglePublic} backgroundColor={isPublic ? '#0DC39F' : '#8B96A4'} />
          <span styleName='publicGuidance'>Allow the public to see this post.</span>
        </div>
        <span styleName='publicState'>{isPublic ? 'Yes' : 'No'}</span>
      </div>
    )
  }
}
