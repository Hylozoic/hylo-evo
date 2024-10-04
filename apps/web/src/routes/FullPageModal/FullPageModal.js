import cx from 'classnames'
import React, { useState } from 'react'
import { NavLink, Route } from 'react-router-dom'
import isWebView from 'util/webView'
import Icon from 'components/Icon'

import styles from './FullPageModal.module.scss'

export default function FullPageModal ({
  confirmMessage, setConfirmBeforeClose, navigate, goToOnClose,
  content, children, narrow, fullWidth, leftSideBarHidden,
  previousLocation
}) {
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

  if (isWebView()) {
    return (
      <div className={styles.modalSettingsLayout}>
        {multipleTabs && content.map(tab => (
          <Route
            path={tab.path}
            element={tab.render ? tab.render() : tab.component}
            key={tab.path}
          />
        ))}
        {!multipleTabs && (content || children)}
      </div>
    )
  } else {
    return (
      <div className={cx(styles.modal, { [styles.fullWidth]: fullWidth })}>
        <div className={styles.content}>
          <div className={cx(styles.leftSidebar, { [styles.leftSideBarHidden]: leftSideBarHidden })}>
            <div className={cx(styles.leftSidebarFixed, { [styles.border]: multipleTabs })}>
              {multipleTabs && content.filter(tab => !!tab.name).map(tab => (
                <NavLink
                  to={tab.path}
                  end
                  replace
                  className={({ isActive }) => cx("navLink", { [styles.active]: isActive })}
                  key={tab.path}>
                  {tab.name}
                </NavLink>
              ))}
              <Icon name='ArrowDown' className={styles.arrowDown} />
            </div>
          </div>
          {multipleTabs && (
            <div className={cx(styles.center, styles.narrow)}>
              {content.map(tab =>
                <Route
                  path={tab.path}
                  element={tab.render ? tab.render() : tab.component}
                  key={tab.path}
                />)}
            </div>
          )}
          {!multipleTabs && <div className={cx(styles.center, { [styles.narrow]: narrow })}>{content || children}</div>}
          <div className={styles.rightSidebar}>
            <div className={styles.rightSidebarInner}>
              <CloseButton onClose={onClose} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export function CloseButton ({ onClose }) {
  return (
    <div className={styles.closeButton} onClick={onClose}>
      <Icon name='Ex' className={styles.icon} />
    </div>
  )
}
