import PropTypes from 'prop-types'
import React from 'react'
import { find, get, sortBy } from 'lodash/fp'
import './PostFooter.scss'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import cx from 'classnames'
import ReactTooltip from 'react-tooltip'

const { string, array, number, func, object } = PropTypes

export default function PostFooter ({
  id,
  currentUser,
  commenters,
  commentersTotal,
  votesTotal,
  myVote,
  vote,
  type,
  members
}) {
  let imageUrls, caption

  if (type !== 'project') {
    imageUrls = (commenters).map(p => p.avatarUrl)
    caption = commentCaption(commenters, commentersTotal, get('id', currentUser))
  } else {
    imageUrls = (members).map(p => p.avatarUrl)
    caption = commentCaption(members, members.length, get('id', currentUser), 'No project members', 'are a member')
  }

  return <div styleName='footer'>
    <RoundImageRow imageUrls={imageUrls} styleName='people' />
    <span styleName='caption'>{caption}</span>
    <a onClick={vote} styleName={cx('vote-button', {voted: myVote})}
      data-tip-disable={myVote} data-tip='Upvote this post so more people see it.' data-for='postfooter-tt'>
      <Icon name='ArrowUp' styleName='arrowIcon' />
      {votesTotal}
    </a>
    <ReactTooltip
      effect={'solid'}
      delayShow={550}
      id='postfooter-tt' />
  </div>
}
PostFooter.propTypes = {
  id: string,
  commenters: array,
  commentersTotal: number,
  votesTotal: number,
  vote: func,
  currentUser: object
}

export const commentCaption = (commenters, commentersTotal, meId, emptyMessage = 'Be the first to comment', meVerb = 'commented') => {
  commenters = find(c => c.id === meId, commenters) && commenters.length === 2
    ? sortBy(c => c.id !== meId, commenters) // me first
    : sortBy(c => c.id === meId, commenters) // me last
  var names = ''
  const firstName = person => person.id === meId ? 'You' : person.name.split(' ')[0]
  if (commenters.length === 0) {
    return emptyMessage
  } else if (commenters.length === 1) {
    names = firstName(commenters[0])
  } else if (commenters.length === 2) {
    names = `${firstName(commenters[0])} and ${firstName(commenters[1])}`
  } else {
    names = `${firstName(commenters[0])}, ${firstName(commenters[1])} and ${commentersTotal - 2} other${commentersTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} ${meVerb}`
}
