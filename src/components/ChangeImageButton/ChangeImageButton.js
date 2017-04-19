import React, { PropTypes, Component } from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'
const { string } = PropTypes

export default class ChangeImageButton extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { uploadImage, update, uploadSettings, loading, className } = this.props
    const onClick = loading
      ? () => {}
      : () => uploadImage(uploadSettings)
      .then(action => {
        let { error, payload } = action
        if (error) return
        update(payload)
      })

    const iconName = loading ? 'Clock' : 'AddImage'

    return <div styleName='button' onClick={onClick} className={className}>
      <Icon name={iconName} styleName='icon black' /><Icon name={iconName} styleName='icon white' />
    </div>
  }
}
