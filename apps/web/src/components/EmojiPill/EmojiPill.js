import React from 'react'
import cx from 'classnames'
import Pill from 'components/Pill'
import { Tooltip } from 'react-tooltip'

import classes from './EmojiPill.module.scss'

export default function EmojiPill ({ emojiFull, onClick = () => {}, count, userList, selected, toolTip }) {
  return (
    <div data-tooltip-content={toolTip} data-tooltip-id={`${emojiFull}-emoji`}>
      <Pill
        darkText
        id={emojiFull}
        key={emojiFull}
        label={`${emojiFull} ${count}`}
        onClick={onClick ? () => onClick(emojiFull) : null}
        className={cx(classes.tagPill, { [classes.selected]: selected })}

      />
      <Tooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        className='pill-tooltip'
        delayShow={0}
        effect='solid'
        id={`${emojiFull}-emoji`}
        multiline
      />
    </div>

  )
}
