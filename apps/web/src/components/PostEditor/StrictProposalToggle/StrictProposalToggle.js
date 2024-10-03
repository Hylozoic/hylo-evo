import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import SwitchStyled from 'components/SwitchStyled'
import Icon from 'components/Icon'
import styles from './StrictProposalToggle.module.scss'
const { func, bool } = PropTypes

// Not used in v1 but will keep
class StrictProposalToggle extends Component {
  static propTypes = {
    isStrictProposal: bool,
    toggleStrictProposal: func
  }

  static defaultProps = {
    isStrictProposal: false
  }

  render () {
    const { isStrictProposal, toggleStrictProposal, t } = this.props

    return (
      <div className={cx(styles.toggleContainer, { [styles.toggleIsActive]: isStrictProposal })}>
        <div className={styles.toggle}>
          <Icon name='Lock' className={styles.toggleIcon} /> {t('Strict Proposal:')}
          <SwitchStyled checked={isStrictProposal} onChange={toggleStrictProposal} backgroundColor={isStrictProposal ? '#0DC39F' : '#8B96A4'} />
          <span className={styles.guidance}>{isStrictProposal ? t('The proposal has stricter rules about editing. Hover for more details') : t('The proposal is informal and easily edited')}</span>
        </div>
      </div>
    )
  }
}
export default withTranslation()(StrictProposalToggle)
