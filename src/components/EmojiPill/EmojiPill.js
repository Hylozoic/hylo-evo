import React from 'react'
import cx from 'classnames'
import Pill from 'components/Pill'
import ReactTooltip from 'react-tooltip'

import './EmojiPill.scss'

export default function EmojiPill ({ emojiFull, onClick = () => {}, count, userList, selected, toolTip }) {
  return (
    <div data-tip={toolTip} data-for={`${emojiFull}-emoji`}>
      <Pill
        key={emojiFull}
        onClick={() => onClick(emojiFull)}
        styleName={cx('tag-pill', { selected })}
        darkText
        label={`${emojiFull} ${count}`}
        id={emojiFull}

      />
      <ReactTooltip
        backgroundColor='rgba(35, 65, 91, 1.0)'
        className='pill-tooltip'
        effect='solid'
        delayShow={0}
        multiline
        id={`${emojiFull}-emoji`}
      />
    </div>

  )
}
