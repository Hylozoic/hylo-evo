import React from 'react'
import cx from 'classnames'
import './QuorumBar.scss'
import { useTranslation } from 'react-i18next'
import { PROPOSAL_STATUS_COMPLETED } from 'store/models/Post'

const QuorumBar = ({ totalVoters, quorum, actualVoters, proposalStatus }) => {
  const { t } = useTranslation()

  const votersForQuorum = Math.ceil((quorum / 100) * totalVoters)
  const actualVotersWidth = (actualVoters / totalVoters) * 100
  const quorumReached = actualVoters >= votersForQuorum

  let quorumStatus = quorumReached ? t('Quorum reached') : t('Quorum')
  if (proposalStatus === PROPOSAL_STATUS_COMPLETED && !quorumReached) quorumStatus = t('Quorum not reached')

  return (
    <div styleName='vote-progress-container'>
      <div styleName='actual-voters' style={{ width: `${actualVotersWidth}%` }}>
        <div styleName='quorum-text'>{quorumStatus}</div>
      </div>
      <div styleName='quorum-bar' style={{ width: `${quorum}%` }}>
        {!quorumReached && <div styleName={cx('quorum-number', { 'quorum-reached': quorumReached, 'big-quorum': quorum > 70 })}>{quorum}% {actualVoters || 0}/{totalVoters}</div>}
      </div>
      <div styleName='total-voters-bar' />
    </div>
  )
}

export default QuorumBar
