import React, { PropTypes } from 'react'

export default function LinkPreview ({ url, className }) {
  return <div className={className}>{url}</div>
}
LinkPreview.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string
}
