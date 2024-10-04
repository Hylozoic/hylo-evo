import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { PROPOSAL_STATUS_COMPLETED } from 'store/models/Post'
import Icon from 'components/Icon/Icon'


import classes from './QuorumBar.module.scss'

const QuorumBar = ({ totalVoters, quorum, actualVoters, proposalStatus }) => {
  const { t } = useTranslation()

  const votersForQuorum = Math.ceil((quorum / 100) * totalVoters)
  const actualVotersWidth = (actualVoters / totalVoters) * 100
  const quorumReached = actualVoters >= votersForQuorum

  let quorumStatus = quorumReached ? t('Quorum reached') : t('Quorum')
  if (proposalStatus === PROPOSAL_STATUS_COMPLETED && !quorumReached) quorumStatus = t('Quorum not reached')

  return (
    <div className={classes.quorumContainer}>
      <Icon name='Info' className={classes.quorumTooltip} tooltipContent={t('quorumExplainer')} tooltipTid='quorum-tt' />
      <div className={classes.voteProgressContainer}>
        <div className={classes.actualVoters} style={{ width: `${actualVotersWidth}%` }}>
          {quorum > 10 && <div className={classes.quorumText}>{quorumStatus}{' '}{quorumReached && quorum > 20 && t('voterCount', { count: actualVoters })}</div>}
        </div>
        <div className={classes.quorumBar} style={{ width: `${quorum}%` }}>
          {!quorumReached && <div className={cx(classes.quorumNumber, { [classes.quorumReached]: quorumReached, [classes.bigQuorum]: quorum > 70 })}>{quorum}% ({actualVoters || 0}/{votersForQuorum})</div>}
        </div>
        <div className={classes.totalVotersBar} />
      </div>
      <Tooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        id='quorum-tt'
      />
    </div>
  )
}

export default QuorumBar
