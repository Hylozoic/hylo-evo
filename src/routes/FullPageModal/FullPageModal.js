import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './FullPageModal.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import cx from 'classnames'
const { object, func, array, oneOfType } = PropTypes

export default class FullPageModal extends Component {
  static propTypes = {
    content: oneOfType([array, object]),
    onClose: func
  }

  render () {
    const { onClose, content, children, narrow } = this.props

    const multipleTabs = Array.isArray(content)

    return <div styleName='modal'>
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
            <CloseButton onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  }
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
