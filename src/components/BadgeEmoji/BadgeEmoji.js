import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import './badgeEmoji.scss'

export default function Badge ({ emoji, expanded, className, common, border, onClick, name, id, responsibilities = [] }) {
  if (!emoji) return null

  // TODO: why is this items?
  responsibilities = responsibilities?.items ? responsibilities.items : responsibilities

  // XXX: hacky way to determine if this is an important system role, having a responsibilit of Administration, Manage Content, or Remove Members
  common = common || responsibilities.find(r => ['1', '3', '4'].includes(r.id))

  return (
    <>
      <span
        className={className}
        onClick={onClick}
        data-tip='hello'
        data-for={`${id}-${name}-badge-tt`}
        styleName={cx(expanded ? 'badge' : 'badge-collapsed', { border, common })}
      >
        <span styleName={expanded ? 'badgeSymbol' : 'badgeSymbol-collapsed'}>{emoji}</span>
      </span>
      <Tooltip
        delay={150}
        position='bottom'
        offset={{ top: 0, right: 3 }}
        id={`${id}-${name}-badge-tt`}
        getContent={() => (
          <div styleName='tipContent'>
            <span>{name}</span>
            {responsibilities.length > 0 && (
              <ul>
                {responsibilities.map(r => (
                  <li key={r.id}>{r.title}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      />
    </>
  )
}
