import React, { PropTypes, Component } from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'
const { string } = PropTypes

export default class ChangeImageButton extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const {
      uploadImage, update, uploadSettings, loading, className, children
    } = this.props
    const iconName = loading ? 'Clock' : 'AddImage'
    let onClick
    if (loading) {
      onClick = () => {}
    } else {
      onClick = () =>
        uploadImage(uploadSettings).then(({ error, payload }) =>
          !error && payload.url && update(payload.url))
    }

    if (children) return <div onClick={onClick}>{children}</div>
    return <div styleName='button' onClick={onClick} className={className}>
      <Icon name={iconName} styleName='icon' />
    </div>
  }
}
