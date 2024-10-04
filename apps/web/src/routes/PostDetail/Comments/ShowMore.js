import React from 'react'
import classes from './ShowMore.module.scss'

export default function ShowMore ({ commentsLength, total, hasMore, fetchComments }) {
  if (!hasMore) return null

  const extra = total - commentsLength

  return <div className={classes.showMore} onClick={fetchComments}>
    View {extra} previous comment{extra > 1 ? 's' : ''}
  </div>
}
