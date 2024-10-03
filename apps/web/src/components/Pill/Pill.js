import cx from 'classnames'
import React, { useState } from 'react'
import Icon from 'components/Icon'
import classes from './Pill.module.scss'

export default function Pill ({
  id,
  label,
  onRemove,
  className,
  editable,
  darkText = false,
  onClick
}) {
  const [removing, setRemoving] = useState(false)
  const deletePill = () => {
    if (editable && onRemove) {
      if (removing) {
        onRemove(id, label)
      } else {
        setRemoving(true)
      }
    }
  }
  const providedOnClick = onClick ? (e) => { e.stopPropagation(); e.preventDefault(); onClick(id, label) } : null
  const mouseOut = () => setRemoving(false)
  const pillStyles = cx(
    classes.pill,
    {
      [classes.clickable]: !!onClick,
      [classes.removable]: editable && onRemove,
      [classes.removing]: editable && onRemove && removing
    },
    darkText ? classes.darkText : classes.grayText
  )

  return (
    <div
      className={cx(pillStyles, className)}
      onMouseLeave={mouseOut}
    >
      <span
        data-tooltip-content='Click to Search'
        data-tooltip-id='pill-label'
        className={classes.displayLabel}
        onClick={providedOnClick}
      >
        {label}
      </span>
      {editable &&
        <Icon
          className={classes.removeLabel}
          tooltipContent='Double click to delete'
          tooltipId='pill-label'
          name='Ex'
          onClick={deletePill}
        />}
    </div>
  )
}
