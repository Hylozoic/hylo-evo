import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import './badgeEmoji.scss'

export default function Badge ({ emoji, expanded, className, common, border, onClick, isModerator, name, id, responsibilities = [] }) {
  if (!emoji) return null
  return (
    <>
      <span
        className={className} onClick={onClick}
        data-tip={responsibilities.length > 0 ? `${name}: ${responsibilities.map(r => r.title).join(', ')}` : name}
        data-for={`${id}-${name}-badge-tt`}
        styleName={cx(expanded ? 'badge' : 'badge-collapsed', { border, isModerator: isModerator || common })}
      >
        <span styleName={expanded ? 'badgeSymbol' : 'badgeSymbol-collapsed'}>{emoji}</span>
      </span>
      <Tooltip
        delay={150}
        position='bottom'
        offset={{ top: 0, right: 3 }}
        id={`${id}-${name}-badge-tt`}
      />
    </>
  )
}
