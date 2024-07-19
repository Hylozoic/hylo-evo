import React, { useState } from 'react'
import cx from 'classnames'
import Icon from 'components/Icon'
import './Pill.scss'

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
    'pill',
    {
      clickable: !!onClick,
      removable: editable && onRemove,
      removing: editable && onRemove && removing
    },
    darkText ? 'dark-text' : 'gray-text'
  )

  return (
    <div
      styleName={pillStyles}
      className={className}
      onMouseLeave={mouseOut}
    >
      <span
        data-tip='Click to Search'
        data-for='pill-label'
        styleName='display-label'
        onClick={providedOnClick}
      >
        {label}
      </span>
      {editable &&
        <Icon
          styleName='remove-label'
          dataTip='Double click to delete'
          dataTipFor='pill-label'
          name='Ex'
          onClick={deletePill}
        />}
    </div>
  )
}
