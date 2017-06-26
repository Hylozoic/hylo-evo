import React, { PropTypes } from 'react'

export default function LinkPreview ({className, linkPreview: { title, imageUrl, id }}) {
  return <div className={className}>{title}<img src={imageUrl} />{id}</div>
}
LinkPreview.propTypes = {
  linkPreview: PropTypes.object.isRequired,
  className: PropTypes.string
}
