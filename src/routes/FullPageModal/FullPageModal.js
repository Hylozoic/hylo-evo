import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './FullPageModal.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import cx from 'classnames'

export default class FullPageModal extends Component {
  state = {
    entryLocation: this.props.previousLocation
  }

  onClose = () => {
    const { entryLocation } = this.state
    const { confirmMessage, setConfirmBeforeClose, navigate, goToOnClose } = this.props
    const closeLocation = goToOnClose || entryLocation

    if (confirmMessage && window.confirm(confirmMessage)) {
      setConfirmBeforeClose(false)
      navigate(closeLocation)
    } else {
      navigate(closeLocation)
    }
  }

  render () {
    const { content, children, narrow, topicView } = this.props

    const multipleTabs = Array.isArray(content)

    return <div styleName={cx('modal', { topicView })}>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <div styleName={cx('left-sidebar-fixed', { border: multipleTabs })}>
            {multipleTabs && content.filter(tab => !!tab.name).map(tab =>
              <NavLink to={tab.path}
                exact
                replace
                activeClassName={styles.active}
                styleName='nav-link'
                key={tab.path}>
                {tab.name}
              </NavLink>)}
          </div>
        </div>
        {multipleTabs && <div styleName='center narrow'>
          {content.map(tab =>
            <Route path={tab.path}
              exact
              render={tab.render ? tab.render : () => tab.component}
              key={tab.path} />)}
        </div>}
        {!multipleTabs && <div styleName={cx('center', { narrow })}>{content || children}</div>}
        <div styleName='right-sidebar'>
          <div styleName='right-sidebar-inner'>
            <CloseButton onClose={this.onClose} />
          </div>
        </div>
      </div>
    </div>
  }
}

FullPageModal.propTypes = {
  children: PropTypes.any,
  content: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  narrow: PropTypes.bool,
  onClose: PropTypes.func
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
