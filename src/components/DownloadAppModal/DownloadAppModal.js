import ReactDOM from 'react-dom'
import React from 'react'
import './DownloadAppModal.scss'
const modalRoot = document.getElementById('modal-root')

export default function DownloadAppModal () {
  return <Modal>
    <div styleName='modal'>
      <div styleName='modal-container'>
        <h1>Download the app to sign up!</h1>
      </div>
    </div>
  </Modal>
}

export class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    modalRoot.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}
