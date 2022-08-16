import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import './PostLabel.scss'

const { string } = PropTypes

export default function PostLabel ({ type, className }) {
  let styleName = cx('label', type)

  const typeLowercase = type.toLowerCase()
  const typeName = type.charAt(0).toUpperCase() + typeLowercase.slice(1)

  return <div styleName={styleName} className={className}>
    <div styleName='label-inner' data-tip={typeName} data-for='typeTip'><Icon name={typeName} styleName='typeIcon' /></div>
    {type === 'completed' && <div styleName='completed'><Icon name='Star' styleName='starIcon' /></div>}

    <ReactTooltip
      backgroundColor={'rgba(35, 65, 91, 1.0)'}
      effect={'solid'}
      delayShow={0}
      id='typeTip' />
  </div>
}
PostLabel.propTypes = {
  type: string.isRequired,
  className: string
}
