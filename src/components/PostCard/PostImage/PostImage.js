import React from 'react'
import { bgImageStyle } from 'util/index'
import './PostImage.scss'

const PostImage = ({ imageUrl, className, linked }) => {
  if (!imageUrl) return null
  return <div style={bgImageStyle(imageUrl)} className={className}>
    {linked && <a href={imageUrl} target='_blank' styleName='link'>&nbsp;</a>}
  </div>
}

export default PostImage
