import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import SwitchStyled from 'components/SwitchStyled'
import Icon from 'components/Icon'
import classes from './PublicToggle.module.scss'
const { func, bool } = PropTypes

class PublicToggle extends Component {
  static propTypes = {
    isPublic: bool,
    togglePublic: func
  }

  static defaultProps = {
    isPublic: false
  }

  render () {
    const { isPublic, togglePublic, t } = this.props

    return (
      <div className={cx(classes.publicToggleContainer, { [classes.postIsPublic]: isPublic })}>
        <div className={classes.publicToggle}>
          <Icon name='Public' className={classes.publicToggleIcon} /> {t('Make Public:')}
          <SwitchStyled checked={isPublic} onChange={togglePublic} backgroundColor={isPublic ? '#0DC39F' : '#8B96A4'} />
          <span className={classes.publicGuidance}>{isPublic ? t('Anyone on Hylo can see this post') : t('Currently, only groups you specify above will see this post')}</span>
        </div>
      </div>
    )
  }
}
export default withTranslation()(PublicToggle)
