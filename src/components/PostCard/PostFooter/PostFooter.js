import React from 'react'
import { get, sortBy } from 'lodash/fp'
import './PostFooter.scss'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import cx from 'classnames'

const { string, array, number, func, object } = React.PropTypes

export default function PostFooter ({ id, currentUser, commenters, commentersTotal, votesTotal, myVote, vote }) {
  return <div styleName='footer'>
    <RoundImageRow imageUrls={(commenters).map(c => c.avatarUrl)} styleName='people' />
    <span styleName='caption'>{commentCaption(commenters, commentersTotal, get('id', currentUser))}</span>
    <div styleName='votes'>
      <a onClick={vote} styleName={cx('votes-link', {voted: myVote})} data-on-click='true'>
        <Icon name='ArrowUp' styleName='arrowIcon' data-on-click='true' />{votesTotal}
      </a>
    </div>
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

export const commentCaption = (commenters, commentersTotal, meId) => {
  commenters = sortBy(c => c.id !== meId, commenters)
  var names = ''
  const firstName = person => person.id === meId ? 'You' : person.name.split(' ')[0]
  if (commentersTotal === 0) {
    return 'Be the first to comment'
  } else if (commentersTotal === 1) {
    names = firstName(commenters[0])
  } else if (commentersTotal === 2) {
    names = `${firstName(commenters[0])} and ${firstName(commenters[1])}`
  } else {
    names = `${firstName(commenters[0])}, ${firstName(commenters[1])} and ${commentersTotal - 2} other${commentersTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} commented`
}
