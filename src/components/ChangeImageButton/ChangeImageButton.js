import React, { PropTypes, Component } from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'
const { string } = PropTypes

export default class ChangeImageButton extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { uploadImage, update, uploadSettings, loading, className, child } = this.props
    const iconName = loading ? 'Clock' : 'AddImage'
    const onClick = loading
      ? () => {}
      : () => uploadImage(uploadSettings)
      .then(action => {
        let { error, payload } = action
        if (error) return
        update(payload)
      })
    if (child) return <div onClick={onClick}>{child}</div>
    return <div styleName='button' onClick={onClick} className={className}>
      <Icon name={iconName} styleName='icon' />
    </div>
  }
}
