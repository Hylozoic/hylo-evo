import React from 'react'
import EmojiPicker from 'components/EmojiPicker'
import EmojiPill from 'components/EmojiPill'
import useReactionActions from 'hooks/useReactionActions'

import './EmojiRow.scss'

export default function EmojiRow (props) {
  const {
    className,
    currentUser,
    postReactions = [],
    commentReactions = [],
    myReactions = [],
    postId,
    commentId
  } = props
  const { reactOnEntity, removeReactOnEntity } = useReactionActions()

  const entityType = commentId ? 'comment' : 'post'
  const entityReactions = commentId ? commentReactions : postReactions
  const handleReaction = (emojiFull) => reactOnEntity({ commentId, emojiFull, entityType, postId })
  const handleRemoveReaction = (emojiFull) => removeReactOnEntity({ commentId, emojiFull, entityType, postId })
  const myEmojis = myReactions.map((reaction) => reaction.emojiFull)
  const usersReactions = entityReactions.reduce((accum, entityReaction) => {
    if (accum[entityReaction.emojiFull]) {
      const { userList } = accum[entityReaction.emojiFull]
      accum[entityReaction.emojiFull] = { emojiFull: entityReaction.emojiFull, userList: [...userList, entityReaction.user.name] }
    } else {
      accum[entityReaction.emojiFull] = { emojiFull: entityReaction.emojiFull, userList: [entityReaction.user.name] }
    }

    if (myEmojis.includes(entityReaction.emojiFull)) accum[entityReaction.emojiFull] = { ...accum[entityReaction.emojiFull], loggedInUser: true }

    return accum
  }, {})
  return (
    <div className={className}>
      {entityReactions && <div styleName='footer-reactions'>
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
    </div>
  )
}
