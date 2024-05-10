import cx from 'classnames'
import React, { useMemo } from 'react'
import { throttle } from 'lodash/fp'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { PROPOSAL_STATUS_CASUAL, PROPOSAL_STATUS_COMPLETED, PROPOSAL_STATUS_DISCUSSION, PROPOSAL_STATUS_VOTING, PROPOSAL_TYPE_MULTI_UNRESTRICTED, PROPOSAL_TYPE_SINGLE } from 'store/models/Post'
import {
  addProposalVote,
  removeProposalVote,
  swapProposalVote
} from '../../../store/actions/proposals'
import QuorumBar from 'components/QuorumBar/QuorumBar'
import './PostBodyProposal.scss'
import RoundImageRow from 'components/RoundImageRow'

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
  proposalType,
  proposalOptions,
  proposalVotes,
  isAnonymousVote,
  proposalOutcome,
  startTime,
  quorum,
  endTime,
  groups,
  id
}) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const proposalOptionsArray = useMemo(() => proposalOptions?.items || [], [proposalOptions])
  const proposalVotesArray = useMemo(() => proposalVotes?.items || [], [proposalVotes])

  const currentUserVotes = useMemo(() => proposalVotesArray.filter(vote => vote?.user?.id === currentUser.id), [proposalVotesArray, currentUser.id])
  const currentUserVotesOptionIds = useMemo(() => currentUserVotes.map(vote => vote.optionId), [currentUserVotes])
  const proposalVoterCount = useMemo(() => calcNumberOfVoters(proposalVotesArray), [proposalVotesArray])
  const numberOfPossibleVoters = useMemo(() => calcNumberOfPossibleVoters(groups), [groups])
  const highestVotedOptions = useMemo(() => calcHighestVotedOptions(proposalVotesArray, proposalOptionsArray), [proposalVotesArray, proposalOptionsArray])

  function handleVote (optionId) {
    if (proposalType === PROPOSAL_TYPE_SINGLE) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else if (currentUserVotesOptionIds.length === 0) {
        dispatch(addProposalVote({ optionId, postId: id }))
      } else {
        const removeOptionId = currentUserVotesOptionIds[0]
        dispatch(swapProposalVote({ postId: id, addOptionId: optionId, removeOptionId }))
      }
    }
    if (proposalType === PROPOSAL_TYPE_MULTI_UNRESTRICTED) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else {
        dispatch(addProposalVote({ optionId, postId: id }))
      }
    }
  }

  const handleVoteThrottled = throttle(200, handleVote)

  return (
    <div styleName={cx('proposal-body-container', { discussion: proposalStatus === PROPOSAL_STATUS_DISCUSSION, voting: proposalStatus === PROPOSAL_STATUS_VOTING, casual: proposalStatus === PROPOSAL_STATUS_CASUAL, completed: proposalStatus === PROPOSAL_STATUS_COMPLETED })}>
      <div styleName={cx('proposal-status')}>
        {proposalStatus === PROPOSAL_STATUS_DISCUSSION && t('Discussion in progress')}
        {proposalStatus === PROPOSAL_STATUS_VOTING && t('Voting open')}
        {proposalStatus === PROPOSAL_STATUS_COMPLETED && t('Voting ended')}
        {proposalStatus === PROPOSAL_STATUS_CASUAL && t('Voting open')}
      </div>
      <div styleName={cx('proposal-timing')}>
        {!startTime && t('Open timeframe')}
        {startTime && proposalStatus !== PROPOSAL_STATUS_COMPLETED && `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`}
        {startTime && proposalStatus === PROPOSAL_STATUS_COMPLETED && `${new Date(endTime).toLocaleDateString()}`}
      </div>
      {proposalOptionsArray && proposalOptionsArray.map((option, i) => {
        const optionVotes = proposalVotesArray.filter(vote => vote.optionId === option.id)
        const voterNames = isAnonymousVote ? [] : optionVotes.map(vote => vote.user.name)
        const avatarUrls = optionVotes.map(vote => vote.user.avatarUrl)
        return (
          <div key={`${option.id}+${currentUserVotesOptionIds.includes(option.id)}`} styleName={cx('proposal-option', { selected: currentUserVotesOptionIds.includes(option.id), completed: proposalStatus === PROPOSAL_STATUS_COMPLETED, highestVote: (proposalStatus === PROPOSAL_STATUS_COMPLETED || proposalOutcome) && highestVotedOptions.includes(option.id) })} onClick={isVotingOpen(proposalStatus) ? () => handleVoteThrottled(option.id) : () => {}}>
            <div styleName='proposal-option-text-container'>
              <div styleName='proposal-option-emoji'>
                {option.emoji}
              </div>
              <div styleName='proposal-option-text'>
                {option.text}
              </div>
            </div>
            <div styleName='proposal-option-votes-container' data-tip={voterNames.join('\n')} data-for='voters-tt'>
              <div styleName='proposal-option-vote-count'>
                {optionVotes.length}
              </div>
              {!isAnonymousVote &&
                <div styleName='proposal-option-vote-avatars'>
                  <RoundImageRow imageUrls={avatarUrls.slice(0, 3)} inline styleName='people' blue />
                </div>}
            </div>
          </div>
        )
      }
      )}
      <ReactTooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        id='voters-tt'
      />
      {quorum && <QuorumBar totalVoters={numberOfPossibleVoters} quorum={quorum} actualVoters={proposalVoterCount} proposalStatus={proposalStatus} />}
      {proposalOutcome && <div styleName='proposal-outcome'>  {t('Outcome')}: {proposalOutcome}</div>}
    </div>
  )
}
