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
  onClick: providedOnClick = () => {}
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
  const onClick = () => providedOnClick(id, label)
  const mouseOut = () => setRemoving(false)
  const pillStyles = cx(
    'pill',
    {
      'clickable': !!onClick,
      'removable': editable && onRemove,
      'removing': editable && onRemove && removing
    },
    darkText ? 'dark-text' : 'gray-text'
  )

  return <div
    styleName={pillStyles}
    className={className}
    onMouseLeave={mouseOut}
  >
    <span
      data-tip='Click to Search'
      data-for='pill-label'
      styleName='display-label'
      onClick={onClick}
    >
      {label}
    </span>
    {editable &&
      <Icon
        styleName='remove-label'
        dataTip='Double click to delete'
        dataTipFor='pill-label'
        name='Ex'
        onClick={deletePill} />}
  </div>
}
