import React from 'react'
import cx from 'classnames'
import './component.scss'

const { string } = React.PropTypes

export default function PostLabel ({ type, className }) {
  let styleName = cx('label', type)
  return <div styleName={styleName} className={className}>
    {type}
  </div>
}
PostLabel.propTypes = {
  type: string.isRequired,
  className: string
}
