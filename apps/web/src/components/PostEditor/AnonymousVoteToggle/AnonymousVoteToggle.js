import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import SwitchStyled from 'components/SwitchStyled'
import Icon from 'components/Icon'
import classes from './AnonymousVoteToggle.module.scss'
const { func, bool } = PropTypes

class AnonymousVoteToggle extends Component {
  static propTypes = {
    isAnonymousVote: bool,
    toggleAnonymousVote: func
  }

  static defaultProps = {
    isAnonymousVote: false
  }

  render () {
    const { isAnonymousVote, toggleAnonymousVote, t } = this.props

    return (
      <div className={cx(classes.toggleContainer, { [classes.toggleIsActive]: isAnonymousVote })}>
        <div className={classes.toggle}>
          <Icon name='Hidden' className={classes.toggleIcon} /> {t('Anonymous Vote:')}
          <SwitchStyled checked={isAnonymousVote} onChange={toggleAnonymousVote} backgroundColor={isAnonymousVote ? '#0DC39F' : '#8B96A4'} />
          <span className={classes.guidance}>{isAnonymousVote ? t('Voting will be anonymous') : t('You can see how people voted')}</span>
        </div>
      </div>
    )
  }
}
export default withTranslation()(AnonymousVoteToggle)
