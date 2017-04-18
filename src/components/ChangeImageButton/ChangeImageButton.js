import React, { PropTypes, Component } from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'
const { string } = PropTypes

export default class ChangeImageButton extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { uploadImage, update, uploadSettings, loading } = this.props
    const onClick = loading
      ? () => {}
      : () => uploadImage(uploadSettings)
      .then(action => {
        let { error, payload } = action
        if (error) return
        update(payload)
      })

    return <div onClick={onClick}>
      <Icon name='Home' />
    </div>
  }
}
