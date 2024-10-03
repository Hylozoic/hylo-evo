import cx from 'classnames'
import React, { useMemo } from 'react'
import { throttle } from 'lodash/fp'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import { PROPOSAL_STATUS_CASUAL, PROPOSAL_STATUS_COMPLETED, PROPOSAL_STATUS_DISCUSSION, PROPOSAL_STATUS_VOTING, VOTING_METHOD_MULTI_UNRESTRICTED, VOTING_METHOD_SINGLE } from 'store/models/Post'
import {
  addProposalVote,
  removeProposalVote,
  swapProposalVote
} from '../../../store/actions/proposals'
import QuorumBar from 'components/QuorumBar'
import classes from './PostBodyProposal.module.scss'
import RoundImageRow from 'components/RoundImageRow'
import Icon from 'components/Icon/Icon'

const calcNumberOfVoters = (votes) => {
  return votes.reduce((acc, vote) => {
    if (!acc.includes(vote.user.id)) {
      acc.push(vote.user.id)
    }
    return acc
  }, []).length
}

const calcNumberOfPossibleVoters = (groups) => {
  return groups.reduce((acc, group) => {
    return acc + group.memberCount
  }, 0)
}

const calcHighestVotedOptions = (votes) => {
  const tally = {}

  votes.forEach(vote => {
    if (tally[vote.optionId]) {
      tally[vote.optionId]++
    } else {
      tally[vote.optionId] = 1
    }
  })

  let maxTally = 0
  for (const optionId in tally) {
    if (tally[optionId] > maxTally) {
      maxTally = tally[optionId]
    }
  }

  const highestVotedOptions = []
  for (const optionId in tally) {
    if (tally[optionId] === maxTally) {
      highestVotedOptions.push(optionId)
    }
  }

  return highestVotedOptions
}

const isVotingOpen = (proposalStatus) => proposalStatus === PROPOSAL_STATUS_VOTING || proposalStatus === PROPOSAL_STATUS_CASUAL

export default function PostBodyProposal ({
  currentUser,
  proposalStatus,
  votingMethod,
  proposalOptions,
  proposalVotes,
  isAnonymousVote,
  isFlagged,
  proposalOutcome,
  startTime,
  quorum,
  endTime,
  fulfilledAt,
  groups,
  id
}) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const proposalOptionsArray = useMemo(() => proposalOptions || [], [proposalOptions])
  const proposalVotesArray = useMemo(() => proposalVotes?.items || [], [proposalVotes])

  const currentUserVotes = useMemo(() => proposalVotesArray.filter(vote => vote?.user?.id === currentUser.id), [proposalVotesArray, currentUser.id])
  const currentUserVotesOptionIds = useMemo(() => currentUserVotes.map(vote => vote.optionId), [currentUserVotes])
  const proposalVoterCount = useMemo(() => calcNumberOfVoters(proposalVotesArray), [proposalVotesArray])
  const numberOfPossibleVoters = useMemo(() => calcNumberOfPossibleVoters(groups), [groups])
  const highestVotedOptions = useMemo(() => calcHighestVotedOptions(proposalVotesArray, proposalOptionsArray), [proposalVotesArray, proposalOptionsArray])

  const votingComplete = proposalStatus === PROPOSAL_STATUS_COMPLETED || fulfilledAt

  function handleVote (optionId) {
    if (votingMethod === VOTING_METHOD_SINGLE) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else if (currentUserVotesOptionIds.length === 0) {
        dispatch(addProposalVote({ optionId, postId: id }))
      } else {
        const removeOptionId = currentUserVotesOptionIds[0]
        dispatch(swapProposalVote({ postId: id, addOptionId: optionId, removeOptionId }))
      }
    }
    if (votingMethod === VOTING_METHOD_MULTI_UNRESTRICTED) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else {
        dispatch(addProposalVote({ optionId, postId: id }))
      }
    }
  }

  const handleVoteThrottled = throttle(200, handleVote)

  const votePrompt = votingMethod === VOTING_METHOD_SINGLE ? t('select one option') : t('select one or more options')

  return (
    <div className={cx(classes.proposalBodyContainer, {
      [classes.discussion]: proposalStatus === PROPOSAL_STATUS_DISCUSSION,
      [classes.voting]: proposalStatus === PROPOSAL_STATUS_VOTING,
      [classes.casual]: proposalStatus === PROPOSAL_STATUS_CASUAL,
      [classes.completed]: votingComplete,
      [classes.isFlagged]: isFlagged
    })}>
      <div className={classes.proposalStatus}>
        {isAnonymousVote && <Icon name='Hidden' className={classes.anonymousVoting} tooltipContent={t('Anonymous voting')} tooltipId='anon-tt' />}
        {proposalStatus === PROPOSAL_STATUS_DISCUSSION && t('Discussion in progress')}
        {proposalStatus === PROPOSAL_STATUS_VOTING && t('Voting open') + ', ' + votePrompt}
        {votingComplete && t('Voting ended')}
        {proposalStatus === PROPOSAL_STATUS_CASUAL && !votingComplete && t('Voting open') + ', ' + votePrompt}
      </div>
      <Tooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        id='anon-tt'
      />
      <div className={classes.proposalTiming}>
        {startTime && proposalStatus !== PROPOSAL_STATUS_COMPLETED && `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`}
        {startTime && votingComplete && `${new Date(endTime).toLocaleDateString()}`}
      </div>
      {proposalOptionsArray && proposalOptionsArray.map((option, i) => {
        const optionVotes = proposalVotesArray.filter(vote => vote.optionId === option.id)
        const voterNames = isAnonymousVote ? [] : optionVotes.map(vote => vote.user.name)
        const avatarUrls = optionVotes.map(vote => vote.user.avatarUrl)
        return (
          <div
            key={`${option.id}+${currentUserVotesOptionIds.includes(option.id)}`}
            className={cx(classes.proposalOption, {
              [classes.selected]: currentUserVotesOptionIds.includes(option.id),
              [classes.completed]: votingComplete,
              [classes.highestVote]: (votingComplete || proposalOutcome) && highestVotedOptions.includes(option.id)
            })}
            onClick={isVotingOpen(proposalStatus) && !votingComplete ? () => handleVoteThrottled(option.id) : () => {}}
          >
            <div className={classes.proposalOptionTextContainer}>
              <div className={classes.proposalOptionEmoji}>
                {option.emoji}
              </div>
              <div className={classes.proposalOptionText}>
                {option.text}
              </div>
            </div>
            <div className={classes.proposalOptionVotesContainer} data-tooltip-content={`<pre>${voterNames.join('\r\n')}</pre>`} data-tooltip-id='voters-tt'>
              {(!isAnonymousVote || votingComplete) &&
                <div className={classes.proposalOptionVoteCount}>
                  {optionVotes.length}
                </div>}
              {!isAnonymousVote &&
                <div className={classes.proposalOptionVoteAvatars}>
                  <RoundImageRow imageUrls={avatarUrls.slice(0, 3)} inline className={classes.people} blue />
                </div>}
            </div>
          </div>
        )
      }
      )}
      <Tooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        html
        id='voters-tt'
      />
      {quorum && (quorum > 0) && <QuorumBar totalVoters={numberOfPossibleVoters} quorum={quorum} actualVoters={proposalVoterCount} proposalStatus={proposalStatus} />}
      {proposalOutcome && fulfilledAt && <div className={classes.proposalOutcome}>  {t('Outcome')}: {proposalOutcome}</div>}
    </div>
  )
}
