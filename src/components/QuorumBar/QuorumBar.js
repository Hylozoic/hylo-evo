import React from 'react'
import cx from 'classnames'
import './QuorumBar.scss'
import { useTranslation } from 'react-i18next'
import { PROPOSAL_STATUS_COMPLETED } from 'store/models/Post'
import Icon from 'components/Icon/Icon'
import ReactTooltip from 'react-tooltip'

const QuorumBar = ({ totalVoters, quorum, actualVoters, proposalStatus }) => {
  const { t } = useTranslation()

  const votersForQuorum = Math.ceil((quorum / 100) * totalVoters)
  const actualVotersWidth = (actualVoters / totalVoters) * 100
  const quorumReached = actualVoters >= votersForQuorum

  let quorumStatus = quorumReached ? t('Quorum reached') : t('Quorum')
  if (proposalStatus === PROPOSAL_STATUS_COMPLETED && !quorumReached) quorumStatus = t('Quorum not reached')

  return (
    <div styleName='quorum-container'>
      <Icon name='Info' styleName='quorum-tooltip' dataTip={t('quorumExplainer')} dataTipFor='quorum-tt' />
      <div styleName='vote-progress-container'>
        <div styleName='actual-voters' style={{ width: `${actualVotersWidth}%` }}>
          {quorum > 10 && <div styleName='quorum-text'>{quorumStatus}{' '}{quorumReached && quorum > 20 && t('voterCount', { count: actualVoters })}</div>}
        </div>
        <div styleName='quorum-bar' style={{ width: `${quorum}%` }}>
          {!quorumReached && <div styleName={cx('quorum-number', { 'quorum-reached': quorumReached, 'big-quorum': quorum > 70 })}>{quorum}% ({actualVoters || 0}/{votersForQuorum})</div>}
        </div>
        <div styleName='total-voters-bar' />
      </div>
      <ReactTooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        id='quorum-tt'
      />
    </div>
  )
}

export default QuorumBar
