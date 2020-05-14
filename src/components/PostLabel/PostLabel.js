import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import './PostLabel.scss'

const { string } = PropTypes

export default function PostLabel ({ type, className }) {
  let styleName = cx('label', type)
  return <div styleName={styleName} className={className}>
    <div className='label-inner'>{type === 'completed' &&
    <img src='/star-icon.svg' height='16px' style={{ margin: '0 2px 2px 0' }} />} {type}
    </div>
  </div>
}
PostLabel.propTypes = {
  type: string.isRequired,
  className: string
}
