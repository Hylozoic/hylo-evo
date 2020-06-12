import React from 'react'
import cx from 'classnames'
import './SwitchStyled.scss'

function SwitchStyled ({ onChange, checked, disabled, backgroundColor, name }) {
  const handleToggle = () => {
    onChange(checked, name)
  }
  return (
    <div styleName={cx('container', { containerDisabled: disabled })} onClick={disabled ? null : handleToggle}>

      <input type='hidden' name={name} checked={checked} />
      <span styleName={'track'} style={{ backgroundColor, opacity: checked ? 1 : 0.4 }} />
      <span styleName={cx('button', { buttonChecked: checked })} />
    </div>
  )
}

SwitchStyled.defaultProps = {
  checked: false,
  disabled: false,
  backgroundColor: '#ff44ff',
  onChange: (checked, name) => { console.log(checked, name) }
}

export default SwitchStyled
