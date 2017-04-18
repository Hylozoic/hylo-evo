import React, { PropTypes, Component } from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'
const { string } = PropTypes

export default class ChangeImageButton extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { uploadImage, update } = this.props
    const loading = false
    const uploadSettings = {

    }

    const onClick = loading
      ? () => {}
      : () => uploadImage(uploadSettings)
      .then(action => {
        let { error, payload } = action
        if (error) return
        update(payload)
      })

    return <div onClick={onClick} styleName='change-image'>
      <Icon name='Home' />
    </div>
  }
}
