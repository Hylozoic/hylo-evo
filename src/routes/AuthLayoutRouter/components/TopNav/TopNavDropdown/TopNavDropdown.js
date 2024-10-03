import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import ErrorBoundary from 'components/ErrorBoundary'
import { position } from 'util/scrolling'

import classes from './TopNavDropdown.module.scss'

const TopNavDropdown = React.forwardRef(({ toggleChildren, className, header, body, onToggle }, ref) => {
  const [active, setActive] = useState(false)
  const [neverOpened, setNeverOpened] = useState(true)

  const toggle = (newState) => {
    const newActive = newState ?? !active
    setActive(newActive)
    if (onToggle) onToggle(newActive)
    if (neverOpened && newActive) {
      setNeverOpened(false)
    }
  }

  const toggleRight = document.documentElement.clientWidth - position(ref.current).x
  const triangleStyle = { right: toggleRight - 41 }

  return (
    <div className={className}>
      {active && <div className={classes.backdrop} onClick={() => toggle(false)} />}
      <a onClick={() => toggle()} ref={ref}>
        {toggleChildren}
      </a>
      <div className={cx(classes.wrapper, classes.animateFadeInDown, { [classes.active]: active })}>
        <ul className={classes.menu}>
          <li className={classes.triangle} style={triangleStyle} />
          <ErrorBoundary>
            <li className={classes.header}>
              {header}
            </li>
            {body}
          </ErrorBoundary>
        </ul>
      </div>
    </div>
  )
})

TopNavDropdown.propTypes = {
  toggleChildren: PropTypes.object,
  className: PropTypes.string,
  header: PropTypes.object,
  body: PropTypes.object,
  onToggle: PropTypes.func
}

export default TopNavDropdown
