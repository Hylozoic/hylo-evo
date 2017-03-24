import React from 'react'
import cx from 'classnames'
import styles from './component.scss' // eslint-disable-line no-unused-vars

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
