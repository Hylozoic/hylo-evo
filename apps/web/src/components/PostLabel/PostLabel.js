import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import { Tooltip } from 'react-tooltip'
import cx from 'classnames'
import classes from './PostLabel.module.scss'

const { string } = PropTypes

export default function PostLabel ({ type, className }) {
  const typeLowercase = type.toLowerCase()
  const typeName = type.charAt(0).toUpperCase() + typeLowercase.slice(1)

  return (
    <div className={cx(classes.label, classes[type], className)}>
      <div
        className={cx(classes.labelInner)}
        data-tooltip-content={typeName}
        data-tooltip-id='typeTip'
      >
        <Icon name={typeName} className={classes.typeIcon} />
      </div>
      {type === 'completed' && (
        <div className={classes.completed}>
          <Icon name='Star' className={classes.starIcon} />
        </div>
      )}

      <Tooltip
        className={classes.typeTip}
        delayShow={0}
        id='typeTip'
      />
    </div>
  )
}

PostLabel.propTypes = {
  type: string.isRequired,
  className: string
}
