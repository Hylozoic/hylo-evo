import React, { PropTypes, Component } from 'react'
import styles from './FullPageModal.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
const { object, func, array, oneOfType } = PropTypes
import cx from 'classnames'
import AffixWrapper from 'components/AffixWrapper'

export default class FullPageModal extends Component {
  static propTypes = {
    content: oneOfType([array, object]),
    onClose: func
  }

  render () {
    const { onClose, content, children, narrow } = this.props

    const multipleTabs = Array.isArray(content)

    return <div styleName='modal' id='fullPageModal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <AffixWrapper styleName={cx('sidebar-tabs', {border: multipleTabs})} offset={200} scrollableId='fullPageModal'>
            {multipleTabs && content.map(tab =>
              <NavLink to={tab.path}
                exact
                replace
                activeClassName={styles.active}
                styleName='nav-link'
                key={tab.path}>
                {tab.name}
              </NavLink>)}
          </AffixWrapper>
        </div>
        {multipleTabs && <div styleName='center narrow'>
          {content.map(tab =>
            <Route path={tab.path}
              exact
              render={() => tab.component}
              key={tab.path} />)}
        </div>}
        {!multipleTabs && <div styleName={cx('center', {narrow})}>{content || children}</div>}
        <div styleName='right-sidebar'>
          <CloseButton onClose={onClose} />
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
