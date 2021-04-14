import React from 'react'
import cx from 'classnames'
import './VisibilityToggle.scss'
import Icon from 'components/Icon'

function VisibilityToggle ({ id, onChange, checked, disabled, backgroundColor, name }) {
  const handleToggle = () => {
    onChange({ id, isVisible: checked, name })
  }
  return (
    <div styleName={cx('container', { containerDisabled: disabled }, { visible: checked })} onClick={disabled ? null : handleToggle}>
      <input type='hidden' name={name} defaultChecked={checked} />
      <span styleName='track' />
      <span styleName={cx('button', { buttonChecked: checked })} />
      <Icon name='Eye' styleName='visibleIcon' />
      <Icon name='Hidden' styleName='hiddenIcon' />
    </div>
  )
}

VisibilityToggle.defaultProps = {
  checked: false,
  disabled: false,
  onChange: (checked, name) => { console.log(checked, name) }
}

export default VisibilityToggle
