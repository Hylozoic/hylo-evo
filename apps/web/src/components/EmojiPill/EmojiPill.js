import React from 'react'
import cx from 'classnames'
import Pill from 'components/Pill'
import ReactTooltip from 'react-tooltip'

import './EmojiPill.scss'

export default function EmojiPill ({ emojiFull, onClick = () => {}, count, userList, selected, toolTip }) {
  return (
    <div data-tip={toolTip} data-for={`${emojiFull}-emoji`}>
      <Pill
        darkText
        id={emojiFull}
        key={emojiFull}
        label={`${emojiFull} ${count}`}
        onClick={onClick ? () => onClick(emojiFull) : null}
        styleName={cx('tag-pill', { selected })}

      />
      <ReactTooltip
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
