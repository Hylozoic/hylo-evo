import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import SwitchStyled from 'components/SwitchStyled'
import Icon from 'components/Icon'
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
          <Icon name='Public' styleName='publicToggleIcon' /> Make Public:
          <SwitchStyled checked={isPublic} onChange={togglePublic} backgroundColor={isPublic ? '#0DC39F' : '#8B96A4'} />
          <span styleName='publicGuidance'>{isPublic ? 'Anyone on Hylo can see this post' : 'Currently, only groups you specify above will see this post'}</span>
        </div>
      </div>
    )
  }
}
