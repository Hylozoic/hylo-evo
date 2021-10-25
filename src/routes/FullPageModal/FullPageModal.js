import React, { useState } from 'react'
import styles from './FullPageModal.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import cx from 'classnames'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'

export default function FullPageModal ({
  confirmMessage, setConfirmBeforeClose, navigate, goToOnClose,
  content, children, narrow, fullWidth, leftSideBarHidden,
  previousLocation
}) {
  const { mobileSettingsLayout } = useLayoutFlags()
  const [entryLocation] = useState(previousLocation)

  const onClose = () => {
    const closeLocation = goToOnClose || entryLocation

    if (confirmMessage && window.confirm(confirmMessage)) {
      setConfirmBeforeClose(false)
      navigate(closeLocation)
    } else {
      navigate(closeLocation)
    }
  }

  const multipleTabs = Array.isArray(content)

  if (mobileSettingsLayout) {
    return (
      <div styleName='modalMobileSettings'>
        {multipleTabs && content.map(tab => (
          <Route path={tab.path}
            exact
            render={tab.render ? tab.render : () => tab.component}
            key={tab.path} />
        ))}
        {!multipleTabs && <>
          {content || children}
        </>}
      </div>
    )
  } else {
    return (
      <div styleName={cx('modal', { fullWidth })}>
        <div styleName='content'>
          <div styleName={cx('left-sidebar', { leftSideBarHidden })}>
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
              <Icon name='ArrowDown' styleName='arrowDown' />
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
    )
  }
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
