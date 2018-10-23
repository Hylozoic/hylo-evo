import PropTypes from 'prop-types'
import React from 'react'
import { find, get, sortBy } from 'lodash/fp'
import './PostFooter.scss'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import cx from 'classnames'
import ReactTooltip from 'react-tooltip'

export default class PostFooter extends React.PureComponent {
  render () {
    const {
      currentUser,
      commenters,
      commentersTotal,
      votesTotal,
      myVote,
      vote,
      members,
      onClick,
      type
    } = this.props
    const isProject = type === 'project'
    let avatarUrls, caption
    
    if (isProject) {
      avatarUrls = members.map(p => p.avatarUrl)
      caption = peopleCaption(
        members,
        members.length,
        get('id', currentUser),
        {
          emptyMessage: 'No project members',
          phraseSingular: 'is a member',
          mePhraseSingular: 'are a member',
          pluralPhrase: 'are members'
        }      
      )
    } else {
      avatarUrls = commenters.map(p => p.avatarUrl)
      caption = peopleCaption(
        commenters,
        commentersTotal,
        get('id', currentUser),
        {
          emptyMessage: 'Be the first to comment',
          phraseSingular: 'commented',
          mePhraseSingular: 'commented',
          pluralPhrase: 'commented'
        }      
      )
    }

    return <div styleName='footer'>
      <RoundImageRow imageUrls={avatarUrls} styleName='people' onClick={onClick} />
      <span styleName='caption' onClick={onClick} style={{cursor: onClick ? 'pointer' : 'inherit'}}>
        {caption}
      </span>
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
}

export const peopleCaption = (
  people,
  peopleTotal,
  meId,
  phrases
) => {
  const currentUserIsMember = find(c => c.id === meId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== meId, people) // me first
    : sortBy(c => c.id === meId, people) // me last
  const firstName = person => person.id === meId ? 'You' : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = phrases
  let names = ''
  let phrase = pluralPhrase

  if (sortedPeople.length === 0) return emptyMessage

  if (sortedPeople.length === 1) {
    phrase = currentUserIsMember ? mePhraseSingular : phraseSingular
    names = firstName(sortedPeople[0])
  } else if (sortedPeople.length === 2) {
    names = `${firstName(sortedPeople[0])} and ${firstName(sortedPeople[1])}`
  } else {
    names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} ${phrase}`
}
