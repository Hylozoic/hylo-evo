import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import './badgeEmoji.scss'

export default function Badge ({ emoji, expanded, className, border, onClick, isModerator, name }) {
  if (!emoji) return null
  return (
    <span styleName='badgeWrapper' className={className} onClick={onClick}>
      <span
        data-tip={name}
        data-for={`${name}-badge-tt`}
        styleName={cx(expanded ? 'badge' : 'badge-collapsed', { border, isModerator })}
      >
        <span styleName={expanded ? 'badgeSymbol' : 'badgeSymbol-collapsed'}>{emoji}</span>
      </span>
      <Tooltip
        delay={150}
        position='bottom'
        offset={{ top: 0 }}
        id={`${name}-badge-tt`}
      />
    </span>
  )
}