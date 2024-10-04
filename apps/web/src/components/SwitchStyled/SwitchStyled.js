import React from 'react'
import cx from 'classnames'
import classes from './SwitchStyled.module.scss'

function SwitchStyled ({
  onChange = (checked, name) => { console.log(checked, name) },
  checked = false,
  disabled = false,
  backgroundColor = '#ff44ff',
  name
}) {
  const handleToggle = () => {
    onChange(checked, name)
  }
  return (
    <div className={cx(classes.container, { [classes.containerDisabled]: disabled })} onClick={disabled ? null : handleToggle}>
      <input type='hidden' name={name} defaultChecked={checked} />
      <span className={classes.track} style={{ backgroundColor, opacity: checked ? 1 : 0.4 }} />
      <span className={cx(classes.button, { [classes.buttonChecked]: checked })} />
    </div>
  )
}

export default SwitchStyled
