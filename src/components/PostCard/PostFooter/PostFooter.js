import React from 'react'
import PropTypes from 'prop-types'
import { CURRENT_USER_PROP_TYPES } from 'store/models/Me'
import { find, get, sortBy } from 'lodash/fp'
import './PostFooter.scss'
import RoundImageRow from 'components/RoundImageRow'
import EmojiPicker from 'components/EmojiPicker'
import EmojiPill from 'components/EmojiPill'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'

export default class PostFooter extends React.PureComponent {
  static propTypes= {
    currentUser: PropTypes.shape(CURRENT_USER_PROP_TYPES),
    commenters: PropTypes.array,
    commentersTotal: PropTypes.number,
    constrained: PropTypes.bool,
    myReactions: PropTypes.array,
    postReactions: PropTypes.array,
    reactOnPost: PropTypes.func.isRequired,
    removeReactOnPost: PropTypes.func.isRequired
  }

  render () {
    const {
      currentUser,
      commenters,
      commentersTotal,
      constrained,
      postId,
      postReactions,
      myReactions
    } = this.props
    const handleReaction = (emojiFull) => this.props.reactOnPost(emojiFull)
    const handleRemoveReaction = (emojiFull) => this.props.removeReactOnPost(emojiFull)
    const tooltipId = 'postfooter-tt-' + postId
    const myEmojis = myReactions.map((reaction) => reaction.emojiFull)
    const usersReactions = postReactions.reduce((accum, postReaction) => {
      if (accum[postReaction.emojiFull]) {
        const { userList } = accum[postReaction.emojiFull]
        accum[postReaction.emojiFull] = { emojiFull: postReaction.emojiFull, userList: [...userList, postReaction.user.name] }
      } else {
        accum[postReaction.emojiFull] = { emojiFull: postReaction.emojiFull, userList: [postReaction.user.name] }
      }

      if (myEmojis.includes(postReaction.emojiFull)) accum[postReaction.emojiFull] = { ...accum[postReaction.emojiFull], loggedInUser: true }

      return accum
    }, {})

    return (
      <div styleName={cx('footer', { constrained })}>
        <PeopleInfo people={commenters} peopleTotal={commentersTotal} excludePersonId={get('id', currentUser)} />
        {postReactions && <div styleName={cx('footer-reactions', { constrained })}>
          {Object.values(usersReactions).map(reaction => (
            <EmojiPill
              onClick={reaction.loggedInUser ? handleRemoveReaction : handleReaction}
              key={reaction.emojiFull}
              emojiFull={reaction.emojiFull}
              count={reaction.userList.length}
              selected={reaction.loggedInUser}
              toolTip={reaction.userList.join('<br>')}
            />
          ))}
          {currentUser ? <EmojiPicker handleReaction={handleReaction} myEmojis={myEmojis} handleRemoveReaction={handleRemoveReaction} /> : ''}
        </div>}
        <Tooltip
          delay={550}
          id={tooltipId}
        />
      </div>
    )
  }
}

export function PeopleInfo ({
  people,
  peopleTotal,
  excludePersonId,
  phrases = {
    emptyMessage: 'Be the first to comment',
    phraseSingular: 'commented',
    mePhraseSingular: 'commented',
    pluralPhrase: 'commented'
  },
  onClick
}) {
  const currentUserIsMember = find(c => c.id === excludePersonId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== excludePersonId, people) // me first
    : sortBy(c => c.id === excludePersonId, people) // me last
  const firstName = person => person.id === excludePersonId ? 'You' : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = phrases
  let names = ''
  let phrase = pluralPhrase

  let caption, avatarUrls
  if (sortedPeople.length === 0) {
    caption = emptyMessage
    avatarUrls = []
  } else {
    if (sortedPeople.length === 1) {
      phrase = currentUserIsMember ? mePhraseSingular : phraseSingular
      names = firstName(sortedPeople[0])
    } else if (sortedPeople.length === 2) {
      names = `${firstName(sortedPeople[0])} and ${firstName(sortedPeople[1])}`
    } else {
      names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`
    }
    caption = `${names} ${phrase}`
    avatarUrls = people.map(p => p.avatarUrl)
  }
  return <span styleName='commenters'>
    <RoundImageRow imageUrls={avatarUrls.slice(0, 3)} styleName='people' onClick={onClick} />
    <span styleName='caption' onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'inherit' }}>
      {caption}
    </span>
  </span>
}
