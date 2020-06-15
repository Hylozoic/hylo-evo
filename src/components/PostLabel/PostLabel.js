import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import cx from 'classnames'
import './PostLabel.scss'

const { string } = PropTypes

export default function PostLabel ({ type, className }) {
  let styleName = cx('label', type)
  return <div styleName={styleName} className={className}>
    <div className='label-inner'>{type === 'completed' &&
    <Icon name='Star' styleName='starIcon' />} {type}
    </div>
  </div>
}
PostLabel.propTypes = {
  type: string.isRequired,
  className: string
}
