import React from 'react'
import EmojiPicker from 'components/EmojiPicker'
import EmojiPill from 'components/EmojiPill'

import './EmojiRow.scss'

export default function EmojiRow (props) {
  const {
    currentUser,
    postReactions,
    myReactions,
    removeReactOnPost,
    reactOnPost
  } = props

  const handleReaction = (emojiFull) => reactOnPost(emojiFull)
  const handleRemoveReaction = (emojiFull) => removeReactOnPost(emojiFull)
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
    <div>
      {postReactions && <div styleName='footer-reactions'>
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
