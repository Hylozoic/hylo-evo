import React from 'react'
import EmojiPicker from 'components/EmojiPicker'
import EmojiPill from 'components/EmojiPill'
import useReactionActions from 'hooks/useReactionActions'

import classes from './EmojiRow.module.scss'

export default function EmojiRow (props) {
  const {
    className,
    comment,
    currentUser,
    onClick,
    post
  } = props
  const { reactOnEntity, removeReactOnEntity } = useReactionActions()

  const entityType = comment ? 'comment' : 'post'
  const myReactions = (comment ? comment.myReactions : post.myReactions) || []
  const entityReactions = (comment ? comment.commentReactions : post.postReactions) || []
  const groupIds = post.groups.map(g => g.id)
  const handleReaction = (emojiFull) => reactOnEntity({ commentId: comment?.id, emojiFull, entityType, groupIds, postId: post.id })
  const handleRemoveReaction = (emojiFull) => removeReactOnEntity({ commentId: comment?.id, emojiFull, entityType, postId: post.id })
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
    <div className={className} onClick={onClick}>
      {entityReactions && <div className={classes.footerReactions}>
        {Object.values(usersReactions).map(reaction => (
          <EmojiPill
            onClick={currentUser ? reaction.loggedInUser ? handleRemoveReaction : handleReaction : null}
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
