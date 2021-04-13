import React from 'react'
import cx from 'classnames'
import './VisibilityToggle.scss'
import Icon from 'components/Icon'

function VisibilityToggle ({ id, onChange, checked, disabled, backgroundColor, name }) {
  const handleToggle = () => {
    onChange({ id, isVisible: checked, name })
  }
  return (
    <div styleName={cx('container', { containerDisabled: disabled })} onClick={disabled ? null : handleToggle}>
      <input type='hidden' name={name} defaultChecked={checked} />
      <span styleName={'track'} style={{ backgroundColor, opacity: checked ? 1 : 0.4 }} />
      <span styleName={cx('button', { buttonChecked: checked })}><Icon name='Eye' /></span>
    </div>
  )
}

VisibilityToggle.defaultProps = {
  checked: false,
  disabled: false,
  backgroundColor: '#ff44ff',
  onChange: (checked, name) => { console.log(checked, name) }
}

export default VisibilityToggle
