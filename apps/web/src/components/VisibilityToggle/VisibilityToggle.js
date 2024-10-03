import React from 'react'
import cx from 'classnames'
import classes from './VisibilityToggle.module.scss'
import Icon from 'components/Icon'

function VisibilityToggle ({ id, onChange, checked, disabled, backgroundColor, name }) {
  const handleToggle = () => {
    onChange({ id, isVisible: checked, name })
  }
  return (
    <div className={cx(classes.container, { [classes.containerDisabled]: disabled, [classes.visible]: checked })} onClick={disabled ? null : handleToggle}>
      <input type='hidden' name={name} defaultChecked={checked} />
      <span className={classes.track} />
      <span className={cx(classes.button, { [classes.buttonChecked]: checked })} />
      <Icon name='Eye' className={classes.visibleIcon} />
      <Icon name='Hidden' className={classes.hiddenIcon} />
    </div>
  )
}

VisibilityToggle.defaultProps = {
  checked: false,
  disabled: false,
  onChange: (checked, name) => { console.log(checked, name) }
}

export default VisibilityToggle
