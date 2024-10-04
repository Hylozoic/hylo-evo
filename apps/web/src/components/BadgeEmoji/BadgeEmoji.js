import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import classes from './badgeEmoji.module.scss'

export default function Badge ({ emoji, expanded, className, common, border, onClick, name, id, responsibilities = [] }) {
  if (!emoji) return null

  // TODO: why is this items?
  responsibilities = responsibilities?.items ? responsibilities.items : responsibilities

  // XXX: hacky way to determine if this is an important system role, having a responsibilit of Administration, Manage Content, or Remove Members
  common = common || responsibilities.find(r => ['1', '3', '4'].includes(r.id))

  return (
    <>
      <span
        className={cx(
          className,
          expanded ? classes.badge : classes.badgeCollapsed,
          { [classes.border]: border, [classes.common]: common }
        )}
        onClick={onClick}
        data-tooltip-content='hello'
        data-tooltip-id={`${id}-${name}-badge-tt`}
      >
        <span className={expanded ? classes.badgeSymbol : classes.badgeSymbolCollapsed}>{emoji}</span>
      </span>
      <Tooltip
        delay={150}
        position='bottom'
        offset={{ top: 0, right: 3 }}
        id={`${id}-${name}-badge-tt`}
        content={() => (
          <div className={classes.tipContent}>
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
