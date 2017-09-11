import React from 'react'
import { bgImageStyle } from 'util/index'

const PostImage = ({ imageUrl, className }) => {
  if (!imageUrl) return null
  return <div style={bgImageStyle(imageUrl)} className={className} />
}

export default PostImage
